import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDonationEventDto } from './dto/create-donation_event.dto';
import { UpdateDonationEventDto } from './dto/update-donation_event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEvent } from './entities/donation_event.entity';
import { In, Repository } from 'typeorm';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';

@Injectable()
export class DonationEventsService {
  constructor(
    @InjectRepository(DonationEvent)
    private donationEventsRepo: Repository<DonationEvent>,
    @InjectRepository(Volunteer) private volunteersRepo: Repository<Volunteer>,
  ) {}

  async create(createDonationEventDto: CreateDonationEventDto) {
    // retrieving volunteers
    const volunteers = await this.volunteersRepo.find({
      where: {
        id: In(createDonationEventDto.volunteers),
      },
    });

    return this.donationEventsRepo.save({
      ...createDonationEventDto,
      volunteers: volunteers,
    });
  }

  async findAll() {
    return await this.donationEventsRepo.find();
  }

  async findOne(id: string) {
    const existingEvent = await this.donationEventsRepo.findOneBy({ id });
    if (!existingEvent) throw new NotFoundException('Event not found');

    return existingEvent;
  }

  async update(id: string, updateDonationEventDto: UpdateDonationEventDto) {
    const existingEvent = await this.findOne(id);

    const volunteers = await this.volunteersRepo.find({
      where: {
        id: In(updateDonationEventDto.volunteers),
      },
    });

    Object.assign(existingEvent, {
      ...updateDonationEventDto,
      volunteers: volunteers,
    });
  }

  async remove(id: string) {
    const existingEvent = await this.findOne(id);
    await this.donationEventsRepo.softRemove(existingEvent);

    return {
      success: true,
      message: 'Event deleted successfully',
    }
  }
}
