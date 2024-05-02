import { Injectable } from '@nestjs/common';
import { CreateLabReportDto } from './dto/create-lab_report.dto';
import { UpdateLabReportDto } from './dto/update-lab_report.dto';

@Injectable()
export class LabReportsService {
  create(createLabReportDto: CreateLabReportDto) {
    return 'This action adds a new labReport';
  }

  findAll() {
    return `This action returns all labReports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} labReport`;
  }

  update(id: number, updateLabReportDto: UpdateLabReportDto) {
    return `This action updates a #${id} labReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} labReport`;
  }
}
