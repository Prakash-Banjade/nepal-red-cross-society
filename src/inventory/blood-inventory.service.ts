import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, In, Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { BloodInventory } from './entities/blood_inventory.entity';
import { CreateBloodInventoryDto } from './dto/create-blood_inventory.dto';
import { BloodInventoryItemQueryDto } from './dto/blood-inventory-item-query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { BloodInventoryStatus, BloodItems, BloodType, RhFactor } from 'src/core/types/global.types';

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
            const savedInventory = await this.bloodInventoryRepo.save(inventory);
            const inventoryItem = this.inventoryItemRepo.create({
                itemType: createBloodInventoryDto.itemType,
                inventory: savedInventory,
                itemId: createBloodInventoryDto.itemId,
                expiresAt: createBloodInventoryDto.expiresAt,
                bloodBagNo: createBloodInventoryDto.bloodBagNo
            });
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

    async findOne(id: string, queryDto: BloodInventoryItemQueryDto) {
        const existingInventory = await this.bloodInventoryRepo.findOne({
            where: { id },
            relations: { items: true },
        })
        if (!existingInventory) throw new NotFoundException('BloodInventory not found');

        const queryBuilder = this.inventoryItemRepo.createQueryBuilder('bloodItem');

        queryBuilder
            .orderBy("bloodItem.createdAt", queryDto.order)
            .skip(queryDto.search ? undefined : queryDto.skip)
            .take(queryDto.search ? undefined : queryDto.take)
            .andWhere(new Brackets(qb => {
                qb.where([
                    { bloodBagNo: ILike(`%${queryDto.search ?? ''}%`) },
                ]);
                queryDto.status && qb.andWhere({ status: queryDto.status });
                queryDto.itemType && qb.andWhere({ itemType: queryDto.itemType });

            }))
            .leftJoinAndSelect('bloodItem.inventory', 'inventory')

        return paginatedData(queryDto, queryBuilder, {
            id: existingInventory.id,
            bloodType: existingInventory.bloodType,
            rhFactor: existingInventory.rhFactor,
        });
    }

    // async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    //   const existingInventory = await this.findOne(id);

    // }

    async remove(id: string) {
        // const existingInventory = await this.findOne(id);
        const existingInventory = await this.bloodInventoryRepo.findOne({
            where: { id },
            relations: { items: true },
        })
        if (!existingInventory) throw new NotFoundException('BloodInventory not found');

        await this.bloodInventoryRepo.remove(existingInventory);
    }

    async checkIfBloodAvailable(bloodType: BloodType, rhFactor: RhFactor, bloodItems: BloodItems[]) {
        let bloodItemAvailable: boolean = true;

        for (const bloodItem of bloodItems) {
            const existingBloodItem = await this.inventoryItemRepo.findOne({
                where: {
                    inventory: { bloodType, rhFactor },
                    itemType: bloodItem
                }
            })

            if (!existingBloodItem) bloodItemAvailable = false;

            if (existingBloodItem) return existingBloodItem;
        }

        if (!bloodItemAvailable) throw new BadRequestException('Requested blood is not available at the moment. Please try again later.');
    }

    async removeBloodItemFromInventory(inventoryItemId: string) {
        const existingInventoryItem = await this.inventoryItemRepo.findOne({
            where: { id: inventoryItemId },
        })

        if (!existingInventoryItem) throw new NotFoundException('Blood item not found');

        await this.inventoryItemRepo.remove(existingInventoryItem);
    }
}
