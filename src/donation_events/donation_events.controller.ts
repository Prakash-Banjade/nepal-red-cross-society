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
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@ApiTags('Donation Event')
@ApiBearerAuth()
@Controller('donation-events')
export class DonationEventsController {
  constructor(private readonly donationEventsService: DonationEventsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ApiOperation({ description: "Add a new donation event", summary: "Create new donation event" })
  create(@Body() createDonationEventDto: CreateDonationEventDto) {
    return this.donationEventsService.create(createDonationEventDto);
  }

  @Get()
  @ApiOperation({ description: "Get all donation events", summary: "View donation events" })
  findAll() {
    return this.donationEventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: "Get a single donation event", summary: "View a single donation event" })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donationEventsService.findOne(id);
  }

  @Patch(':id')
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ApiOperation({ description: "Update a donation event", summary: "Edit existing donation event" })
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDonationEventDto: UpdateDonationEventDto,
  ) {
    return this.donationEventsService.update(id, updateDonationEventDto);
  }

  @Post('deleteMany')
  @ApiOperation({ description: "Delete a donation event", summary: "Delete a donation event" })
  remove(@Body('ids') ids: string[]) {
    return this.donationEventsService.remove(ids);
  }
}
