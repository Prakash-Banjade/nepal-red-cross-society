import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, In, Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { BloodInventory } from './entities/blood_inventory.entity';
import { CreateBloodInventoryDto } from './dto/create-blood_inventory.dto';
import { BloodInventoryItemQueryDto } from './dto/blood-inventory-item-query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { BloodInventoryStatus, BloodItems, BloodType, RhFactor } from 'src/core/types/fieldsEnum.types';

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
            const inventoryItem = this.inventoryItemRepo.create({ itemType: createBloodInventoryDto.itemType, expiresAt: createBloodInventoryDto.expiresAt, inventory: existingInventory, bloodBagNo: createBloodInventoryDto.bagNo });
            await this.inventoryItemRepo.save(inventoryItem);
        } else {
            const inventory = this.bloodInventoryRepo.create({ bloodType: createBloodInventoryDto.bloodType, rhFactor: createBloodInventoryDto.rhFactor });
            const savedInventory = await this.bloodInventoryRepo.save(inventory);
            const inventoryItem = this.inventoryItemRepo.create({
                itemType: createBloodInventoryDto.itemType,
                inventory: savedInventory,
                expiresAt: createBloodInventoryDto.expiresAt,
                bloodBagNo: createBloodInventoryDto.bagNo
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
            .andWhere(new Brackets(qb => { // filter blood items based on current blood type and rhfactor
                qb.andWhere("LOWER(inventory.bloodType) LIKE LOWER(:bloodType)", { bloodType: existingInventory.bloodType });
                qb.andWhere("LOWER(inventory.rhFactor) LIKE LOWER(:rhFactor)", { rhFactor: existingInventory.rhFactor });
            }))

        return paginatedData(queryDto, queryBuilder, {
            id: existingInventory.id,
            bloodType: existingInventory.bloodType,
            rhFactor: existingInventory.rhFactor,
            ...existingInventory.quantityByItemStatus,
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
                    itemType: bloodItem,
                    status: BloodInventoryStatus.USABLE,
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
