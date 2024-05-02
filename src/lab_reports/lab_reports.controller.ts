import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabReportsService } from './lab_reports.service';
import { CreateLabReportDto } from './dto/create-lab_report.dto';
import { UpdateLabReportDto } from './dto/update-lab_report.dto';

@Controller('lab-reports')
export class LabReportsController {
  constructor(private readonly labReportsService: LabReportsService) {}

  @Post()
  create(@Body() createLabReportDto: CreateLabReportDto) {
    return this.labReportsService.create(createLabReportDto);
  }

  @Get()
  findAll() {
    return this.labReportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labReportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabReportDto: UpdateLabReportDto) {
    return this.labReportsService.update(+id, updateLabReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labReportsService.remove(+id);
  }
}
