import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { Donation } from './entities/donation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donor } from 'src/donors/entities/donor.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Certificate } from 'crypto';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { LabReport } from 'src/lab_reports/entities/lab_report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Donation,
      Donor,
      Organization,
      Certificate,
      DonationEvent,
      LabReport,
    ]),
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
})
export class DonationsModule { }
