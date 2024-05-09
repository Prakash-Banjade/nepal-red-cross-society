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
import { DonorsModule } from 'src/donors/donors.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { DonationEventsModule } from 'src/donation_events/donation_events.module';
import { LabReportsModule } from 'src/lab_reports/lab_reports.module';
import { CertificateModule } from 'src/certificate/certificate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Donation,
      Organization,
      Certificate,
      DonationEvent,
      LabReport,
    ]),
    DonorsModule,
    OrganizationsModule,
    DonationEventsModule,
    LabReportsModule,
    CertificateModule,
  ],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule { }
