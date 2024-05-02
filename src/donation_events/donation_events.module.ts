import { Module } from '@nestjs/common';
import { DonationEventsService } from './donation_events.service';
import { DonationEventsController } from './donation_events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationEvent } from './entities/donation_event.entity';
import { VolunteersModule } from 'src/volunteers/volunteers.module';
import { Volunteer } from 'src/volunteers/entities/volunteer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonationEvent,
      Volunteer,
    ]),
  ],
  controllers: [DonationEventsController],
  providers: [DonationEventsService],
})
export class DonationEventsModule { }
