import { Controller, Get, Query, } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { Municipal } from 'src/core/types/municipals.types';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Get('organization')
  async byOrganization(@Query() queryDto: ReportQueryDto) {
    return this.reportsService.byOrganization(queryDto);
  }

  @Get('hospital')
  async byHospital(@Query() queryDto: ReportQueryDto) {
    return this.reportsService.byHospital(queryDto);
  }

  @Get('donation-by-blood-group')
  async byDonationByBloodGroup(@Query() queryDto: ReportQueryDto) {
    return this.reportsService.byDonationByBloodGroup(queryDto);
  }

  @Get('byPositiveRhFactorCentrifuged')
  async byBloodRequestByBloodGroup(@Query() queryDto: ReportQueryDto) {
    return this.reportsService.byPositiveRhFactorCentrifuged(queryDto);
  }

  @Get('municipal/butwal')
  async butwal(@Query() queryDto: ReportQueryDto & { municipal: Municipal }) {
    return this.reportsService.byMunicipalButwal(queryDto, queryDto.municipal);
  }
}
