import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { Volunteer } from './entities/volunteer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(Volunteer)
    private volunteerRepo: Repository<Volunteer>,
    @InjectRepository(DonationEvent)
    private donationEventRepo: Repository<DonationEvent>,
  ) { }

  async create(createVolunteerDto: CreateVolunteerDto) {
    const volunteer = this.volunteerRepo.create(createVolunteerDto);

    return await this.volunteerRepo.save(volunteer);
  }

  async findAll() {
    return await this.volunteerRepo.find();
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

  async remove(id: string) {
    const existingVolunteer = await this.findOne(id);
    await this.volunteerRepo.softRemove(existingVolunteer);

    return {
      success: true,
      message: 'Volunteer deleted successfully',
    }
  }
}
