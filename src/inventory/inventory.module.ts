import { forwardRef, Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { BloodInventory } from './entities/blood_inventory.entity';
import { BloodInventoryService } from './blood-inventory.service';
import { BloodInventoryController } from './blood-inventory.controller';
import { BranchModule } from 'src/branch/branch.module';
import { InventoryItemController } from './inventory-item.controller';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItem } from './entities/inventory-item.entity';
import { BloodBagsModule } from 'src/blood-bags/blood-bags.module';
import { RequestedBloodBag } from 'src/blood_request/entities/requestedBloodBag.entity';
import { BagTypesModule } from 'src/bag-types/bag-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      BloodInventory,
      InventoryItem,
      RequestedBloodBag
    ]),
    forwardRef(() => BloodBagsModule),
    BranchModule,
    BagTypesModule,
  ],
  controllers: [InventoryController, BloodInventoryController, InventoryItemController],
  providers: [InventoryService, BloodInventoryService, InventoryItemService],
  exports: [InventoryService, InventoryItemService, BloodInventoryService]
})
export class InventoryModule { }
