import { Module } from '@nestjs/common';
import { LabReportsService } from './lab_reports.service';
import { LabReportsController } from './lab_reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabReport } from './entities/lab_report.entity';
import { Donation } from 'src/donations/entities/donation.entity';
import { TestCase } from 'src/test_cases/entities/test_case.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LabReport,
      Donation,
      TestCase
    ])
  ],
  controllers: [LabReportsController],
  providers: [LabReportsService],
})
export class LabReportsModule { }
