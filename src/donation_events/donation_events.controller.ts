import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DonationEventsService } from './donation_events.service';
import { CreateDonationEventDto } from './dto/create-donation_event.dto';
import { UpdateDonationEventDto } from './dto/update-donation_event.dto';

@Controller('donation-events')
export class DonationEventsController {
  constructor(private readonly donationEventsService: DonationEventsService) {}

  @Post()
  create(@Body() createDonationEventDto: CreateDonationEventDto) {
    return this.donationEventsService.create(createDonationEventDto);
  }

  @Get()
  findAll() {
    return this.donationEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationEventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDonationEventDto: UpdateDonationEventDto) {
    return this.donationEventsService.update(+id, updateDonationEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationEventsService.remove(+id);
  }
}
