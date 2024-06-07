import { Module } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technician } from './entities/technician.entity';
import { DonationEvent } from 'src/donation_events/entities/donation_event.entity';
import { Address } from 'src/address/entities/address.entity';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Technician,
      DonationEvent,
    ]),
    AddressModule,
  ],
  controllers: [TechniciansController],
  providers: [TechniciansService],
})
export class TechniciansModule {}
