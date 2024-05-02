import { Module } from '@nestjs/common';
import { LabReportsService } from './lab_reports.service';
import { LabReportsController } from './lab_reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabReport } from './entities/lab_report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LabReport,
    ])
  ],
  controllers: [LabReportsController],
  providers: [LabReportsService],
})
export class LabReportsModule { }
