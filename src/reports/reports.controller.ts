import { Controller, Get, Query, } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { MunicipalReportQueryDto, ReportQueryDto } from './dto/report-query.dto';
import { Municipal } from 'src/core/types/municipals.types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Reports')
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
  async byDonationByBloodGroup(@Query() queryDto: ReportQueryDto) { // REPORT NO. 4
    return this.reportsService.byDonationByBloodGroup(queryDto);
  }

  @Get('byBloodRequestByBloodGroup')
  async byBloodRequestByBloodGroup(@Query() queryDto: ReportQueryDto) { // REPORT NO. 5
    return this.reportsService.byBloodRequestByBloodGroup(queryDto);
  }

  @Get('byBloodRequestByBloodGroupCentrifuged')
  async byBloodRequestByBloodGroupCentrifuged(@Query() queryDto: ReportQueryDto) { // REPORT NO. 6
    return this.reportsService.byBloodRequestByBloodGroupCentrifuged(queryDto);
  }

  @Get('municipal')
  async byMunicipal(@Query() queryDto: MunicipalReportQueryDto) {
    return this.reportsService.byMunicipalButwal(queryDto);
  }

  @Get('patient')
  async byPatient(@Query() queryDto: ReportQueryDto) {
    return this.reportsService.byPatient(queryDto);
  }

  @Get('centrifugedComponents')
  async byCentrifugedComponents(@Query() queryDto: ReportQueryDto) {
    return this.reportsService.byCentrifugedComponents(queryDto);
  }
}
