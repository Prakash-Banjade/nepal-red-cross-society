import { Module } from '@nestjs/common';
import { DonationEventsService } from './donation_events.service';
import { DonationEventsController } from './donation_events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationEvent } from './entities/donation_event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DonationEvent]),
  ],
  controllers: [DonationEventsController],
  providers: [DonationEventsService],
})
export class DonationEventsModule { }
