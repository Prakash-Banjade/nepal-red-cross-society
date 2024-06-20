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
import { CONSTANTS } from 'src/CONSTANTS';
import { BagTypesService } from 'src/bag-types/bag-types.service';
import { BloodBagStatus, InventoryTransaction } from 'src/core/types/fieldsEnum.types';

@Injectable()
export class InventoryItemService {

    constructor(
        @InjectRepository(InventoryItem) private readonly inventoryItemRepo: Repository<InventoryItem>,
        private readonly inventoryService: InventoryService,
        private readonly branchService: BranchService,
        private readonly bagTypeService: BagTypesService,
    ) { }

    async create(createInventoryItemDto: CreateInventoryItemDto, currentUser: RequestUser) {
        const inventory = await this.inventoryService.findOne(createInventoryItemDto.inventoryId, currentUser);
        const bagType = await this.bagTypeService.findOne(createInventoryItemDto.bagType);
        const bloodBagsCount = await this.getBloodBagsCount(currentUser);

        // checking if inventory is Blood Bag, if yes bag type is required
        if (inventory.name === CONSTANTS.BLOOD_BAG && !createInventoryItemDto.bagType) throw new BadRequestException('Bag type name is required');
        if (inventory.name === CONSTANTS.BLOOD_BAG && !createInventoryItemDto.status) throw new BadRequestException('Bag status is required');

        if (createInventoryItemDto.bagType) {
            if ((createInventoryItemDto.transactionType === InventoryTransaction.ISSUED) && bagType.name in bloodBagsCount && bloodBagsCount[bagType.name] < 0) {
                throw new BadRequestException('Not enough blood bags of type ' + bagType.name);
            }

            const inventoryItem = this.inventoryItemRepo.create({
                ...createInventoryItemDto,
                bagType: bagType.name,
                inventory,
            });
            return await this.inventoryItemRepo.save(inventoryItem);
        }

        const inventoryItem = this.inventoryItemRepo.create({
            ...createInventoryItemDto,
            bagType: null,
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
                queryDto.transactionType && qb.andWhere({ transactionType: queryDto.transactionType });
                queryDto.status && qb.andWhere({ status: queryDto.status });
                queryDto.bagType && qb.andWhere({ bagType: queryDto.bagType });
            }))
            .andWhere(new Brackets(qb => {
                qb.andWhere("LOWER(inventory.id) LIKE LOWER(:inventoryId)", { inventoryId: queryDto.inventoryId }); // filter according to inventory
                qb.andWhere("LOWER(inventory.branchId) LIKE LOWER(:branchId)", { branchId: currentUser.branchId }); // filter by branch
            }))

        const bagCount = await this.getBloodBagsCount(currentUser);

        return paginatedData(queryDto, queryBuilder, {
            inventory: {
                name: inventory.name,
                availableUnits: inventory.quantity,
                unit: inventory.unit,
                bagCount: bagCount
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

    // async getBloodBagsCount(currentUser: RequestUser) {
    //     const bagTypes = await this.bagTypeService.findAll();
    //     const bagTypeNames = bagTypes.map(bagType => bagType.name);
    //     const bloodBagCount = Object.fromEntries(bagTypeNames.map(bagTypeName => [bagTypeName, 0]));

    //     for (const bagTypeName of bagTypeNames) {
    //         const { sum } = await this.inventoryItemRepo.createQueryBuilder('inventoryItem')
    //             .select("SUM(inventoryItem.quantity)", "sum")
    //             .leftJoin('inventoryItem.inventory', 'inventory')
    //             .leftJoin('inventory.branch', 'branch')
    //             .where("inventory.name = :name", { name: CONSTANTS.BLOOD_BAG })
    //             .andWhere(new Brackets(qb => {
    //                 qb.andWhere("LOWER(inventoryItem.bagType) = LOWER(:bagTypeName)", { bagTypeName })
    //                 qb.andWhere("LOWER(branch.id) = LOWER(:branchId)", { branchId: currentUser.branchId })
    //                 qb.andWhere("LOWER(inventoryItem.status) = LOWER(:status)", { status: BloodBagStatus.USABLE })
    //             }))
    //             .getRawOne();

    //         bloodBagCount[bagTypeName] = sum;
    //     }
    //     return bloodBagCount;
    // }

    async getBloodBagsCount(currentUser: RequestUser) {
        const bagTypes = await this.bagTypeService.findAll();
        const bagTypeNames = bagTypes.map(bagType => bagType.name);
        const bloodBagCount = Object.fromEntries(bagTypeNames.map(bagTypeName => [bagTypeName, 0]));

        for (const bagTypeName of bagTypeNames) {
            const issuedBloodBags = await this.inventoryItemRepo.createQueryBuilder('inventoryItem')
                .select("SUM(inventoryItem.quantity)", "sum")
                .leftJoin('inventoryItem.inventory', 'inventory')
                .leftJoin('inventory.branch', 'branch')
                .where("inventory.name = :name", { name: CONSTANTS.BLOOD_BAG })
                .andWhere(new Brackets(qb => {
                    qb.andWhere("LOWER(inventoryItem.bagType) = LOWER(:bagTypeName)", { bagTypeName })
                    qb.andWhere("LOWER(inventoryItem.transactionType) = LOWER(:transactionType)", { transactionType: InventoryTransaction.ISSUED })
                    qb.andWhere("LOWER(branch.id) = LOWER(:branchId)", { branchId: currentUser.branchId })
                    qb.andWhere("LOWER(inventoryItem.status) = LOWER(:status)", { status: BloodBagStatus.USABLE })
                }))
                .getRawOne();

            const receivedBloodBags = await this.inventoryItemRepo.createQueryBuilder('inventoryItem')
                .select("SUM(inventoryItem.quantity)", "sum")
                .leftJoin('inventoryItem.inventory', 'inventory')
                .leftJoin('inventory.branch', 'branch')
                .where("inventory.name = :name", { name: CONSTANTS.BLOOD_BAG })
                .andWhere(new Brackets(qb => {
                    qb.andWhere("LOWER(inventoryItem.bagType) = LOWER(:bagTypeName)", { bagTypeName })
                    qb.andWhere("LOWER(inventoryItem.transactionType) = LOWER(:transactionType)", { transactionType: InventoryTransaction.RECEIVED })
                    qb.andWhere("LOWER(branch.id) = LOWER(:branchId)", { branchId: currentUser.branchId })
                    qb.andWhere("LOWER(inventoryItem.status) = LOWER(:status)", { status: BloodBagStatus.USABLE })
                }))
                .getRawOne()

            bloodBagCount[bagTypeName] = receivedBloodBags.sum - issuedBloodBags.sum;
        }
        return bloodBagCount;
    }

    async update(id: string, updateInventoryItemDto: Partial<CreateInventoryItemDto>, currentUser: RequestUser) {
        const existingInventoryItem = await this.findOne(id, currentUser);
        const bagType = await this.bagTypeService.findOne(updateInventoryItemDto.bagType);

        const inventory = updateInventoryItemDto?.inventoryId ? await this.inventoryService.findOne(updateInventoryItemDto.inventoryId, currentUser) : existingInventoryItem.inventory;
        const newBagType = updateInventoryItemDto?.bagType ? await this.bagTypeService.findOne(updateInventoryItemDto.bagType) : existingInventoryItem.bagType;

        const bloodBagsCount = await this.getBloodBagsCount(currentUser);

        if (inventory.name === CONSTANTS.BLOOD_BAG
            && updateInventoryItemDto.transactionType === InventoryTransaction.ISSUED
            && bagType.name in bloodBagsCount && bloodBagsCount[bagType.name] < 0) {
            throw new BadRequestException('Not enough blood bags of type ' + bagType.name);
        }

        Object.assign(existingInventoryItem, {
            ...updateInventoryItemDto,
            bagType: newBagType,
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
