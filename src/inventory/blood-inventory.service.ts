import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { BloodInventory } from './entities/blood_inventory.entity';
import { CreateBloodInventoryDto } from './dto/create-blood_inventory.dto';

@Injectable()
export class BloodInventoryService {
    constructor(
        @InjectRepository(BloodInventory) private readonly bloodInventoryRepo: Repository<BloodInventory>,
        @InjectRepository(InventoryItem) private readonly inventoryItemRepo: Repository<InventoryItem>,
    ) { }

    async create(createBloodInventoryDto: CreateBloodInventoryDto) {
        // check if blood type exists in inventory
        const existingInventory = await this.bloodInventoryRepo.findOne({ where: { bloodType: createBloodInventoryDto.bloodType, rhFactor: createBloodInventoryDto.rhFactor }, relations: { items: true } });
        if (existingInventory) {
            const inventoryItem = this.inventoryItemRepo.create({ itemType: createBloodInventoryDto.itemType, itemId: createBloodInventoryDto.itemId, expiresAt: createBloodInventoryDto.expiresAt, inventory: existingInventory, bloodBagNo: createBloodInventoryDto.bloodBagNo });
            await this.inventoryItemRepo.save(inventoryItem);
        } else {
            const inventory = this.bloodInventoryRepo.create({ bloodType: createBloodInventoryDto.bloodType, rhFactor: createBloodInventoryDto.rhFactor });
            const inventoryItem = this.inventoryItemRepo.create({ itemType: createBloodInventoryDto.itemType, inventory, itemId: createBloodInventoryDto.itemId, expiresAt: createBloodInventoryDto.expiresAt, bloodBagNo: createBloodInventoryDto.bloodBagNo });
            await this.bloodInventoryRepo.save(inventory);
            await this.inventoryItemRepo.save(inventoryItem);
        }

        return {
            message: 'BloodInventory created successfully',
        }
    }

    async findAll() {
        const inventories = await this.bloodInventoryRepo.find({ relations: { items: true } });

        const inventoriesWithQuantities = inventories.map(inventory => {
            return {
                ...inventory,
                quantities: inventory.quantity
            };
        });

        return inventoriesWithQuantities;
    }

    async findOne(id: string) {
        const existingInventory = await this.bloodInventoryRepo.findOne({
            where: { id },
            relations: { items: true },
        })
        if (!existingInventory) throw new NotFoundException('BloodInventory not found');

        return existingInventory;
    }

    // async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    //   const existingInventory = await this.findOne(id);

    // }

    async remove(id: string) {
        const existingInventory = await this.findOne(id);

        await this.bloodInventoryRepo.remove(existingInventory);
    }
}
