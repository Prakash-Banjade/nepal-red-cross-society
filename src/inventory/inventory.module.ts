import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { BloodInventory } from './entities/blood_inventory.entity';
import { BloodInventoryService } from './blood-inventory.service';
import { BloodInventoryController } from './blood-inventory.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      InventoryItem,
      BloodInventory,
    ])
  ],
  controllers: [InventoryController, BloodInventoryController],
  providers: [InventoryService, BloodInventoryService],
  exports: [InventoryService, BloodInventoryService]
})
export class InventoryModule { }
