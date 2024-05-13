import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { Volunteer } from './entities/volunteer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { Address } from 'src/address/entities/address.entity';
import { PageDto } from 'src/core/dto/page.dto.';
import { PageOptionsDto } from 'src/core/dto/pageOptions.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { PageMetaDto } from 'src/core/dto/pageMeta.dto';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(Volunteer)
    private volunteerRepo: Repository<Volunteer>,
    @InjectRepository(DonationEvent)
    private donationEventRepo: Repository<DonationEvent>,
    @InjectRepository(Address)
    private addressRepo: Repository<Address>,
  ) { }

  async create(createVolunteerDto: CreateVolunteerDto) {
    // evaluate address
    const { province, district, municipality, ward, street } = createVolunteerDto;
    const address = this.addressRepo.create({ province, district, municipality, ward, street });

    const volunteer = this.volunteerRepo.create({
      ...createVolunteerDto,
      address,
    });

    address.volunteer = volunteer;
    await this.addressRepo.save(address);

    return await this.volunteerRepo.save(volunteer);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Volunteer>> {

    const queryBuilder = this.queryBuilder();


    queryBuilder
      .orderBy("volunteer.createdAt", pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)

    return paginatedData(pageOptionsDto, queryBuilder);

    // const itemCount = await queryBuilder.getCount();
    // const { entities } = await queryBuilder.getRawAndEntities();

    // const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: string) {
    const existingVolunteer = await this.volunteerRepo.findOneBy({ id });
    if (!existingVolunteer) throw new NotFoundException('Volunteer not found');

    return existingVolunteer;
  }

  async update(id: string, updateVolunteerDto: UpdateVolunteerDto) {
    const existingVolunteer = await this.findOne(id);

    const donationEvent = updateVolunteerDto.donationEvent ? await this.donationEventRepo.findOneBy({ id: updateVolunteerDto.donationEvent }) : null;

    Object.assign(existingVolunteer, {
      ...updateVolunteerDto,
      donationEvent,
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

  private queryBuilder(): SelectQueryBuilder<Volunteer> {
    return this.volunteerRepo.createQueryBuilder("volunteer")
  }
}
