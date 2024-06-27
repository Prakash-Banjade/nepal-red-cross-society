import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, Query, UseInterceptors } from '@nestjs/common';
import { LabReportsService } from './lab_reports.service';
import { CreateLabReportDto } from './dto/create-lab_report.dto';
import { UpdateLabReportDto } from './dto/update-lab_report.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { Action, RequestUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/queryDto';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { TransactionInterceptor } from 'src/core/interceptors/transaction.interceptor';

@ApiTags('Lab Reports')
@Controller('lab-reports')
export class LabReportsController {
  constructor(private readonly labReportsService: LabReportsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseInterceptors(TransactionInterceptor)
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createLabReportDto: CreateLabReportDto, @CurrentUser() currentUser: RequestUser) {
    return this.labReportsService.create(createLabReportDto, currentUser);
  }

  @Get()
  @ApiPaginatedResponse(CreateLabReportDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll(@Query() queryDto: QueryDto) {
    return this.labReportsService.findAll(queryDto);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.labReportsService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(TransactionInterceptor)
  @Throttle({ default: { limit: 1, ttl: 2000 } })
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLabReportDto: UpdateLabReportDto, @CurrentUser() currentUser: RequestUser) {
    return this.labReportsService.update(id, updateLabReportDto, currentUser);
  }

  @Post('deleteMany')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Body('ids') ids: string[]) {
    return this.labReportsService.remove(ids);
  }
}
