import { Module } from '@nestjs/common';
import { LabReportsService } from './lab_reports.service';
import { LabReportsController } from './lab_reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabReport } from './entities/lab_report.entity';
import { Donation } from 'src/donations/entities/donation.entity';
import { TestCase } from 'src/test_cases/entities/test_case.entity';
import { TestResult } from 'src/test_cases/entities/test_result.entity';
import { InventoryItem } from 'src/inventory/entities/inventory-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LabReport,
      Donation,
      TestCase,
      TestResult,
      InventoryItem,
    ]),
  ],
  controllers: [LabReportsController],
  providers: [LabReportsService],
  exports: [LabReportsService],
})
export class LabReportsModule { }
