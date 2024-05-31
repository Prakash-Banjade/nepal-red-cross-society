import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryItem } from './entities/inventory-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      InventoryItem,
    ])
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule { }
