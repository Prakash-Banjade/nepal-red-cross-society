import { Module } from '@nestjs/common';
import { DonationEventsService } from './donation_events.service';
import { DonationEventsController } from './donation_events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationEvent } from './entities/donation_event.entity';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonationEvent,
      Volunteer,
    ]),
    OrganizationsModule,
    AddressModule,
  ],
  controllers: [DonationEventsController],
  providers: [DonationEventsService],
  exports: [DonationEventsService],
})
export class DonationEventsModule { }
