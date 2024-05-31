import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';

@Injectable()
export class InventoryService {

  constructor(
    @InjectRepository(Inventory) private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(InventoryItem) private readonly inventoryItemRepo: Repository<InventoryItem>,
  ) { }

  async create(createInventoryDto: CreateInventoryDto) {
    // check if blood type exists in inventory
    const existingInventory = await this.inventoryRepo.findOne({ where: { bloodType: createInventoryDto.bloodType, rhFactor: createInventoryDto.rhFactor }, relations: { items: true } });
    if (existingInventory) {
      // check if item exists in inventory
      const existingItem = existingInventory.items.find(item => item.itemType === createInventoryDto.itemType);
      if (!!existingItem) {
        existingItem.quantity += createInventoryDto.quantity;
        await this.inventoryItemRepo.save(existingItem);
      } else {
        const inventoryItem = this.inventoryItemRepo.create({ quantity: createInventoryDto.quantity, itemType: createInventoryDto.itemType, inventory: existingInventory });
        await this.inventoryItemRepo.save(inventoryItem);
      }
    } else {
      const inventory = this.inventoryRepo.create({ bloodType: createInventoryDto.bloodType, rhFactor: createInventoryDto.rhFactor });
      const inventoryItem = this.inventoryItemRepo.create({ quantity: createInventoryDto.quantity, itemType: createInventoryDto.itemType, inventory });
      await this.inventoryRepo.save(inventory);
      await this.inventoryItemRepo.save(inventoryItem);
    }
  }

  async findAll() {
    return await this.inventoryRepo.find({ relations: { items: true } });
  }

  async findOne(id: string) {
    const existingInventory = await this.inventoryRepo.find({
      relations: { items: true },
    })
    if (!existingInventory) throw new NotFoundException('Inventory not found');

    return existingInventory;
  }

  // async update(id: string, updateInventoryDto: UpdateInventoryDto) {
  //   const existingInventory = await this.findOne(id);

  // }

  async remove(id: string) {
    const existingInventory = await this.findOne(id);

    await this.inventoryRepo.remove(existingInventory);
  }
}
