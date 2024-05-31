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
      const inventoryItem = this.inventoryItemRepo.create({ itemType: createInventoryDto.itemType, itemId: createInventoryDto.itemId, expiresAt: createInventoryDto.expiresAt, inventory: existingInventory });
      await this.inventoryItemRepo.save(inventoryItem);
    } else {
      const inventory = this.inventoryRepo.create({ bloodType: createInventoryDto.bloodType, rhFactor: createInventoryDto.rhFactor });
      const inventoryItem = this.inventoryItemRepo.create({ itemType: createInventoryDto.itemType, inventory, itemId: createInventoryDto.itemId, expiresAt: createInventoryDto.expiresAt });
      await this.inventoryRepo.save(inventory);
      await this.inventoryItemRepo.save(inventoryItem);
    }

    return {
      message: 'Inventory created successfully',
    }
  }

  async findAll() {
    const inventories = await this.inventoryRepo.find({ relations: { items: true } });

    const inventoriesWithQuantities = inventories.map(inventory => {
      return {
        ...inventory,
        quantities: inventory.quantity
      };
    });

    return inventoriesWithQuantities;
  }

  async findOne(id: string) {
    const existingInventory = await this.inventoryRepo.findOne({
      where: { id },
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
