import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DonationEventsService } from './donation_events.service';
import { CreateDonationEventDto } from './dto/create-donation_event.dto';
import { UpdateDonationEventDto } from './dto/update-donation_event.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Donation Event')
@ApiBearerAuth()
@Controller('donation-events')
export class DonationEventsController {
  constructor(private readonly donationEventsService: DonationEventsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  create(@Body() createDonationEventDto: CreateDonationEventDto) {
    return this.donationEventsService.create(createDonationEventDto);
  }

  @Get()
  findAll() {
    return this.donationEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donationEventsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDonationEventDto: UpdateDonationEventDto,
  ) {
    return this.donationEventsService.update(id, updateDonationEventDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.donationEventsService.remove(id);
  }
}
