import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action, RequestUser } from 'src/core/types/global.types';
import { DonorQueryDto } from './dto/donor-query-dto';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from 'src/core/decorators/user.decorator';

@ApiTags('Donors')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createDonorDto: CreateDonorDto) {
    return this.donorsService.create(createDonorDto);
  }

  @Get()
  @ApiPaginatedResponse(CreateDonorDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll(@Query() queryDto: DonorQueryDto) {
    return this.donorsService.findAll(queryDto);
  }

  @Get('me')
  @ChekcAbilities({ action: Action.READ, subject: 'me' })
  getMyDetails(@CurrentUser() user: RequestUser) {
    return this.donorsService.getMyDetails(user.email);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorsService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 1, ttl: 2000 } })
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDonorDto: UpdateDonorDto) {
    return this.donorsService.update(id, updateDonorDto);
  }

  // @Post('deleteMany')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  // remove(@Body('ids') ids: string) {
  //   return this.donorsService.remove(JSON.parse(ids));
  // }

  // @Post('restoreMany')
  // @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
  // @HttpCode(HttpStatus.OK)
  // restore(@Body('ids') ids: string) {
  //   return this.donorsService.restore(JSON.parse(ids));
  // }

  // @Post('emptyTrash')
  // @HttpCode(HttpStatus.OK)
  // @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  // emptyTrash() {
  //   return this.donorsService.clearTrash();
  // }
}
