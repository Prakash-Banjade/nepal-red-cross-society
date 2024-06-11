import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, IsNull, Not, Or, Repository } from 'typeorm';
import { Deleted } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { InventoryService } from './inventory.service';
import { RequestUser } from 'src/core/types/global.types';
import { BranchService } from 'src/branch/branch.service';
import { InventoryItemsQueryDto } from './dto/inventory-items-query.dto';

@Injectable()
export class InventoryItemService {

    constructor(
        @InjectRepository(InventoryItem) private readonly inventoryItemRepo: Repository<InventoryItem>,
        private readonly inventoryService: InventoryService,
        private readonly branchService: BranchService,
    ) { }

    async create(createInventoryItemDto: CreateInventoryItemDto, currentUser: RequestUser) {
        const inventory = await this.inventoryService.findOne(createInventoryItemDto.inventoryId, currentUser);

        const inventoryItem = this.inventoryItemRepo.create({
            ...createInventoryItemDto,
            inventory,
        });
        return await this.inventoryItemRepo.save(inventoryItem);
    }

    async findAll(queryDto: InventoryItemsQueryDto, currentUser: RequestUser) {
        const inventory = await this.inventoryService.findOne(queryDto.inventoryId, currentUser);

        const queryBuilder = this.inventoryItemRepo.createQueryBuilder('inventoryItem');
        const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

        queryBuilder
            .orderBy("inventoryItem.createdAt", queryDto.order)
            .skip(queryDto.search ? undefined : queryDto.skip)
            .take(queryDto.search ? undefined : queryDto.take)
            .withDeleted()
            .where({ deletedAt })
            .leftJoinAndSelect('inventoryItem.inventory', 'inventory')
            .andWhere(new Brackets(qb => {
                qb.where([
                    // { firstName: ILike(`%${queryDto.search ?? ''}%`) },
                ]);
                // queryDto.gender && qb.andWhere({ gender: queryDto.gender });
            }))
            .andWhere(new Brackets(qb => {
                qb.andWhere("LOWER(inventory.id) LIKE LOWER(:inventoryId)", { inventoryId: queryDto.inventoryId }); // filter according to inventory
                qb.andWhere("LOWER(inventory.branchId) LIKE LOWER(:branchId)", { branchId: currentUser.branchId }); // filter by branch
            }))

        return paginatedData(queryDto, queryBuilder, {
            inventory: {
                name: inventory.name,
                availableUnits: inventory.quantity
            }
        });
    }

    async findOne(id: string, currentUser: RequestUser) {
        const branch = await this.branchService.findOne(currentUser.branchId);

        const existingInventory = await this.inventoryItemRepo.findOne({
            relations: ['inventory'],
            where: {
                id,
                inventory: {
                    branch
                }
            },
        })
        if (!existingInventory) throw new NotFoundException('Inventory item not found');

        return existingInventory;
    }

    async update(id: string, updateInventoryItemDto: Partial<CreateInventoryItemDto>, currentUser: RequestUser) {
        const existingInventoryItem = await this.findOne(id, currentUser);

        const inventory = updateInventoryItemDto?.inventoryId ? await this.inventoryService.findOne(updateInventoryItemDto.inventoryId, currentUser) : existingInventoryItem.inventory;

        Object.assign(existingInventoryItem, {
            ...updateInventoryItemDto,
            inventory
        });

        return await this.inventoryItemRepo.save(existingInventoryItem);
    }

    async remove(ids: string[], currentUser: RequestUser) {
        const branch = await this.branchService.findOne(currentUser.branchId);

        const existingInventoryItems = await this.inventoryItemRepo.find({
            where: {
                id: In(ids),
                inventory: { branch }
            },
        });
        await this.inventoryItemRepo.softRemove(existingInventoryItems);

        return {
            success: true,
            message: 'Inventory removed',
        }
    }

    async restore(ids: string[], currentUser: RequestUser) {
        const branch = await this.branchService.findOne(currentUser.branchId);

        const existingInventoryItems = await this.inventoryItemRepo.find({
            where: { id: In(ids), inventory: { branch } },
            withDeleted: true,
        })
        if (!existingInventoryItems) throw new BadRequestException('Item not found');

        return await this.inventoryItemRepo.restore(ids);
    }

    async clearTrash(currentUser: RequestUser) {
        const branch = await this.branchService.findOne(currentUser.branchId);

        return await this.inventoryItemRepo.delete({
            deletedAt: Not(IsNull()),
            inventory: { branch }
        })
    }
}
