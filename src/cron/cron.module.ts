import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { InventoryModule } from 'src/inventory/inventory.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodInventory } from 'src/inventory/entities/blood_inventory.entity';
import { Donor } from 'src/donors/entities/donor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BloodInventory, Donor]),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule { }
