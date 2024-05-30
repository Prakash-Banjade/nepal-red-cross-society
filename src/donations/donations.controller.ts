import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/queryDto';
import { DonationQueryDto } from './dto/donation-query.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Donations')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Get()
  @ApiPaginatedResponse(CreateDonationDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' })

  findAll(@Query() queryDto: DonationQueryDto) {
    return this.donationsService.findAll(queryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donationsService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDonationDto: UpdateDonationDto) {
    return this.donationsService.update(id, updateDonationDto);
  }

  @Post('deleteMany')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Body('ids') ids: string) {
    return this.donationsService.remove(JSON.parse(ids));
  }

  @Post('restoreMany')
  @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
  @HttpCode(HttpStatus.OK)
  restore(@Body('ids') ids: string) {
    return this.donationsService.restore(JSON.parse(ids));
  }

  @Post('emptyTrash')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  emptyTrash() {
    return this.donationsService.clearTrash();
  }
}
