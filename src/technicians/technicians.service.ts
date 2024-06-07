import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { Technician } from './entities/technician.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, In, IsNull, Not, Or, Repository, SelectQueryBuilder } from 'typeorm';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { Address } from 'src/address/entities/address.entity';
import { PageDto } from 'src/core/dto/page.dto.';
import { PageOptionsDto } from 'src/core/dto/pageOptions.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { PageMetaDto } from 'src/core/dto/pageMeta.dto';
import { AddressService } from 'src/address/address.service';
import { extractAddress } from 'src/core/utils/extractAddress';
import getFileName from 'src/core/utils/getImageUrl';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import { TechnicianQueryDto } from './dto/technician-query.dto';

@Injectable()
export class TechniciansService {
  constructor(
    @InjectRepository(Technician)
    private technicianRepo: Repository<Technician>,
    @InjectRepository(DonationEvent)
    private donationEventRepo: Repository<DonationEvent>,
    private readonly addressService: AddressService,
  ) { }

  async create(createTechnicianDto: CreateTechnicianDto) {
    // evaluate address
    const address = await this.addressService.create(extractAddress(createTechnicianDto));

    // evalutating image
    const image = createTechnicianDto.image ? getFileName(createTechnicianDto.image) : null;

    const technician = this.technicianRepo.create({
      ...createTechnicianDto,
      address,
      image
    });

    return await this.technicianRepo.save(technician);
  }

  async findAll(queryDto: TechnicianQueryDto) {
    const queryBuilder = this.technicianRepo.createQueryBuilder('technician');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("technician.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.where([
          { firstName: ILike(`%${queryDto.search ?? ''}%`) },
          { lastName: ILike(`%${queryDto.search ?? ''}%`) },
          { phone: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
      }))
      .leftJoinAndSelect('technician.address', 'address')
      .andWhere(new Brackets(qb => {
        if (queryDto.country) qb.andWhere("LOWER(address.country) LIKE LOWER(:country)", { country: `%${queryDto.country ?? ''}%` });
        if (queryDto.province) qb.andWhere("LOWER(address.province) LIKE LOWER(:province)", { province: `%${queryDto.province ?? ''}%` });
        if (queryDto.district) qb.andWhere("LOWER(address.district) LIKE LOWER(:district)", { district: `%${queryDto.district ?? ''}%` });
        if (queryDto.municipality) qb.andWhere("LOWER(address.municipality) LIKE LOWER(:municipality)", { municipality: `%${queryDto.municipality ?? ''}%` });
        if (queryDto.ward) qb.andWhere("LOWER(address.ward) LIKE LOWER(:ward)", { ward: `%${queryDto.ward ?? ''}%` });
        if (queryDto.street) qb.andWhere("LOWER(address.street) LIKE LOWER(:street)", { street: `%${queryDto.street ?? ''}%` });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingTechnician = await this.technicianRepo.findOne({
      where: { id },
      relations: {
        address: true,
        donationEvent: true
      }
    });
    if (!existingTechnician) throw new NotFoundException('Technician not found');

    return existingTechnician;
  }

  async update(id: string, updateTechnicianDto: UpdateTechnicianDto) {
    const existingTechnician = await this.findOne(id);

    // evaluating donation event
    const donationEvent = updateTechnicianDto.donationEvent ? await this.donationEventRepo.findOneBy({ id: updateTechnicianDto.donationEvent }) : null;

    // evaluating image
    const image = updateTechnicianDto.image ? getFileName(updateTechnicianDto.image) : null;

    // evaluating address
    updateTechnicianDto.country && existingTechnician.address.id && await this.addressService.update(existingTechnician.address.id, extractAddress(updateTechnicianDto));

    Object.assign(existingTechnician, {
      ...updateTechnicianDto,
      donationEvent,
      image,
    })

    return await this.technicianRepo.save(existingTechnician);
  }

  async remove(ids: string[]) {
    const foundTechnicians = await this.technicianRepo.find({
      where: {
        id: In(ids),
        donationEvent: IsNull()
      }
    })
    await this.technicianRepo.softRemove(foundTechnicians);

    return {
      success: true,
      message: 'Technicians deleted successfully',
    }
  }

  async restore(ids: string[]) {
    const existingTechnicians = await this.technicianRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingTechnicians) throw new BadRequestException('Technician not found');

    return await this.technicianRepo.restore(ids);
  }

  async clearTrash() {
    return await this.technicianRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
