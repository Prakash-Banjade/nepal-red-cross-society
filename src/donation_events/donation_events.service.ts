import { Injectable } from '@nestjs/common';
import { CreateDonationEventDto } from './dto/create-donation_event.dto';
import { UpdateDonationEventDto } from './dto/update-donation_event.dto';

@Injectable()
export class DonationEventsService {
  create(createDonationEventDto: CreateDonationEventDto) {
    return 'This action adds a new donationEvent';
  }

  findAll() {
    return `This action returns all donationEvents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} donationEvent`;
  }

  update(id: number, updateDonationEventDto: UpdateDonationEventDto) {
    return `This action updates a #${id} donationEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} donationEvent`;
  }
}
