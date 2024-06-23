import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from 'src/donations/entities/donation.entity';
import { BloodRequest } from 'src/blood_request/entities/blood_request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation, BloodRequest]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule { }
