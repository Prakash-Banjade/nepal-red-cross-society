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
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { QueryDto } from 'src/core/dto/queryDto';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { TechnicianQueryDto } from './dto/technician-query.dto';
import { Throttle } from '@nestjs/throttler';

@ApiBearerAuth()
@ApiTags('Technicians')
@Controller('technicians')
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.techniciansService.create(createTechnicianDto);
  }

  @Get()
  @ApiPaginatedResponse(CreateTechnicianDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll(@Query() queryDto: TechnicianQueryDto) {
    return this.techniciansService.findAll(queryDto);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.techniciansService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 1, ttl: 2000 } })
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTechnicianDto: UpdateTechnicianDto,
  ) {
    return this.techniciansService.update(id, updateTechnicianDto);
  }

  @Post('deleteMany')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Body('ids') ids: string) {
    return this.techniciansService.remove(JSON.parse(ids));
  }

  @Post('restoreMany')
  @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
  @HttpCode(HttpStatus.OK)
  restore(@Body('ids') ids: string) {
    return this.techniciansService.restore(JSON.parse(ids));
  }

  @Post('emptyTrash')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  emptyTrash() {
    return this.techniciansService.clearTrash();
  }
}
