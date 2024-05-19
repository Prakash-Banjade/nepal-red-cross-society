import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DonationEventsService } from './donation_events.service';
import { CreateDonationEventDto } from './dto/create-donation_event.dto';
import { UpdateDonationEventDto } from './dto/update-donation_event.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/queryDto';
import { DonationEvent } from './entities/donation_event.entity';

@ApiTags('Donation Event')
@ApiBearerAuth()
@Controller('donation-events')
export class DonationEventsController {
  constructor(private readonly donationEventsService: DonationEventsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ApiOperation({ description: "Add a new donation event", summary: "Create new donation event" })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createDonationEventDto: CreateDonationEventDto) {
    return this.donationEventsService.create(createDonationEventDto);
  }

  @Get()
  @ApiOperation({ description: "Get all donation events", summary: "View donation events" })
  @ApiPaginatedResponse(CreateDonationEventDto)
  @ChekcAbilities({ action: Action.READ, subject: DonationEvent })
  findAll(@Query() queryDto: QueryDto) {
    return this.donationEventsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ description: "Get a single donation event", summary: "View a single donation event" })
  @ChekcAbilities({ action: Action.READ, subject: DonationEvent })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donationEventsService.findOne(id);
  }

  @Patch(':id')
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ApiOperation({ description: "Update a donation event", summary: "Edit existing donation event" })
  @ApiConsumes('multipart/form-data')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDonationEventDto: UpdateDonationEventDto,
  ) {
    return this.donationEventsService.update(id, updateDonationEventDto);
  }

  @Post('deleteMany')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Body('ids') ids: string) {
    return this.donationEventsService.remove(JSON.parse(ids));
  }

  @Post('restoreMany')
  @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
  @HttpCode(HttpStatus.OK)
  restore(@Body('ids') ids: string) {
    return this.donationEventsService.restore(JSON.parse(ids));
  }

  @Post('emptyTrash')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  emptyTrash() {
    return this.donationEventsService.clearTrash();
  }
}
