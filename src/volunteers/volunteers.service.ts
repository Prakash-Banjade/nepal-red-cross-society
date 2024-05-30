import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { Volunteer } from './entities/volunteer.entity';
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
import { VolunteerQueryDto } from './dto/volunteer-query.dto';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(Volunteer)
    private volunteerRepo: Repository<Volunteer>,
    @InjectRepository(DonationEvent)
    private donationEventRepo: Repository<DonationEvent>,
    private readonly addressService: AddressService,
  ) { }

  async create(createVolunteerDto: CreateVolunteerDto) {
    // evaluate address
    const address = await this.addressService.create(extractAddress(createVolunteerDto));

    // evalutating image
    const image = createVolunteerDto.image ? getFileName(createVolunteerDto.image) : null;

    const volunteer = this.volunteerRepo.create({
      ...createVolunteerDto,
      address,
      image
    });

    return await this.volunteerRepo.save(volunteer);
  }

  async findAll(queryDto: VolunteerQueryDto) {
    const queryBuilder = this.volunteerRepo.createQueryBuilder('volunteer');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("volunteer.createdAt", queryDto.order)
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
      .leftJoinAndSelect('volunteer.address', 'address')
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
    const existingVolunteer = await this.volunteerRepo.findOne({
      where: { id },
      relations: {
        address: true,
        donationEvent: true
      }
    });
    if (!existingVolunteer) throw new NotFoundException('Volunteer not found');

    return existingVolunteer;
  }

  async update(id: string, updateVolunteerDto: UpdateVolunteerDto) {
    const existingVolunteer = await this.findOne(id);

    // evaluating donation event
    const donationEvent = updateVolunteerDto.donationEvent ? await this.donationEventRepo.findOneBy({ id: updateVolunteerDto.donationEvent }) : null;

    // evaluating image
    const image = updateVolunteerDto.image ? getFileName(updateVolunteerDto.image) : null;

    // evaluating address
    updateVolunteerDto.country && existingVolunteer.address.id && await this.addressService.update(existingVolunteer.address.id, extractAddress(updateVolunteerDto));

    Object.assign(existingVolunteer, {
      ...updateVolunteerDto,
      donationEvent,
      image,
    })

    return await this.volunteerRepo.save(existingVolunteer);
  }

  async remove(ids: string[]) {
    const foundVolunteers = await this.volunteerRepo.find({
      where: {
        id: In(ids),
        donationEvent: IsNull()
      }
    })
    await this.volunteerRepo.softRemove(foundVolunteers);

    return {
      success: true,
      message: 'Volunteers deleted successfully',
    }
  }

  async restore(ids: string[]) {
    const existingVolunteers = await this.volunteerRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingVolunteers) throw new BadRequestException('Volunteer not found');

    return await this.volunteerRepo.restore(ids);
  }

  async clearTrash() {
    return await this.volunteerRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
