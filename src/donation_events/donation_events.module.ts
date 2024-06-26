import { Module } from '@nestjs/common';
import { DonationEventsService } from './donation_events.service';
import { DonationEventsController } from './donation_events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationEvent } from './entities/donation_event.entity';
import { Technician } from 'src/technicians/entities/technician.entity';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { AddressModule } from 'src/address/address.module';
import { BloodBagsModule } from 'src/blood-bags/blood-bags.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { BagTypesModule } from 'src/bag-types/bag-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonationEvent,
      Technician,
    ]),
    OrganizationsModule,
    AddressModule,
    BloodBagsModule,
    InventoryModule,
    BagTypesModule,
  ],
  controllers: [DonationEventsController],
  providers: [DonationEventsService],
  exports: [DonationEventsService],
})
export class DonationEventsModule { }
