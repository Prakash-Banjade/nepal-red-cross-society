import { Module } from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { VolunteersController } from './volunteers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { Address } from 'src/address/entities/address.entity';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Volunteer,
      DonationEvent,
    ]),
    AddressModule,
  ],
  controllers: [VolunteersController],
  providers: [VolunteersService],
})
export class VolunteersModule {}
