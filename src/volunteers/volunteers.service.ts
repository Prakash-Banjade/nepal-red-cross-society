import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { Volunteer } from './entities/volunteer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, IsNull, Not, Or, Repository, SelectQueryBuilder } from 'typeorm';
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

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.volunteerRepo.createQueryBuilder('volunteer');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("volunteer.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.page)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere([
        { firstName: ILike(`%${queryDto.search ?? ''}%`) },
        { lastName: ILike(`%${queryDto.search ?? ''}%`) },
      ])

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

    // evaluating address
    const image = updateVolunteerDto.image ? getFileName(updateVolunteerDto.image) : null;

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
        id: In(ids)
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
