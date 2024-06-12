import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, IsNull, Not, Or, Repository } from 'typeorm';
import { BloodInventory } from './entities/blood_inventory.entity';
import { CreateBloodInventoryDto } from './dto/create-blood_inventory.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { BloodBagsService } from 'src/blood-bags/blood-bags.service';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import { RequestUser } from 'src/core/types/global.types';
import { BranchService } from 'src/branch/branch.service';
import { BloodInventoryQueryDto } from './dto/blood-inventory-query.dto';
import { BloodInventoryStatus, BloodItems, BloodType, InventoryTransaction, RhFactor } from 'src/core/types/fieldsEnum.types';
import { Branch } from 'src/branch/entities/branch.entity';
import { BloodRequest } from 'src/blood_request/entities/blood_request.entity';
import { CONSTANTS } from 'src/CONSTANTS';

@Injectable()
export class BloodInventoryService {
    constructor(
        @InjectRepository(BloodInventory) private readonly bloodInventoryRepo: Repository<BloodInventory>,
        @Inject(forwardRef(() => BloodBagsService)) private readonly bloodBagService: BloodBagsService,
        private readonly branchService: BranchService,
    ) { }

    async create(createBloodInventoryDto: CreateBloodInventoryDto, currentUser: RequestUser) {
        const bloodBag = await this.bloodBagService.findOne(createBloodInventoryDto.bloodBag);
        const branch = await this.branchService.findOne(currentUser.branchId);

        const bloodInventoryItem = this.bloodInventoryRepo.create({
            ...createBloodInventoryDto,
            bloodBag,
            branch,
        });

        return this.bloodInventoryRepo.save(bloodInventoryItem);
    }

    async findAll(queryDto: BloodInventoryQueryDto, currentUser: RequestUser) {
        const queryBuilder = this.bloodInventoryRepo.createQueryBuilder('bloodInventory');
        const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

        queryBuilder
            .orderBy("bloodInventory.createdAt", queryDto.order)
            .skip(queryDto.search ? undefined : queryDto.skip)
            .take(queryDto.search ? undefined : queryDto.take)
            .withDeleted()
            .where({ deletedAt })
            // .leftJoinAndSelect('bloodInventory.branch', 'branch')
            .andWhere(new Brackets(qb => {
                qb.where([
                    // { firstName: ILike(`%${queryDto.search ?? ''}%`) },
                ]);
                qb.andWhere({ branch: { id: currentUser.branchId } })
                queryDto.itemType && qb.andWhere({ itemType: queryDto.itemType });
                queryDto.status && qb.andWhere({ status: queryDto.status });
                queryDto.transactionType && qb.andWhere({ transactionType: queryDto.transactionType });
                queryDto.rhFactor && qb.andWhere({ rhFactor: queryDto.rhFactor });
                queryDto.bloodType && qb.andWhere({ bloodType: queryDto.bloodType });
            }))
            .andWhere(new Brackets(qb => { }))

        return paginatedData(queryDto, queryBuilder);
    }

    async findOne(id: string, currentUser: RequestUser) {
        const existingInventory = await this.bloodInventoryRepo.findOne({
            relations: { branch: true },
            where: { id, branch: { id: currentUser.branchId } },
        })
        if (!existingInventory) throw new NotFoundException('BloodInventory not found');

        return existingInventory
    }

    async remove(id: string, currentUser: RequestUser) {
        // const existingInventory = await this.findOne(id);
        const existingInventory = await this.bloodInventoryRepo.findOne({
            relations: { branch: true },
            where: { id, branch: { id: currentUser.branchId } },
        })
        if (!existingInventory) throw new NotFoundException('BloodInventory not found');

        await this.bloodInventoryRepo.remove(existingInventory);
    }

    async checkIfBloodAvailable(bloodType: BloodType, rhFactor: RhFactor, bloodItems: BloodItems[], currentUser: RequestUser) {
        let bloodItemAvailable: boolean = true;

        for (const bloodItem of bloodItems) {
            const existingBloodItem = await this.bloodInventoryRepo.findOne({
                relations: { branch: true },
                where: {
                    branch: { id: currentUser.branchId },
                    component: bloodItem,
                    status: BloodInventoryStatus.USABLE,
                    bloodType,
                    rhFactor,
                }
            })

            if (!existingBloodItem) bloodItemAvailable = false;

            if (existingBloodItem) return existingBloodItem;
        }

        if (!bloodItemAvailable) throw new BadRequestException('Requested blood is not available at the moment. Please try again later.');
    }

    // async removeBloodItemFromInventory(inventoryItemId: string, branch: Branch, bloodrequest: BloodRequest) {
    //     const existingInventoryItem = await this.bloodInventoryRepo.findOne({
    //         where: { id: inventoryItemId },
    //         relations: {
    //             bloodBag: {
    //                 donation: true,
    //                 donationEvent: true
    //             }
    //         }
    //     })

    //     if (!existingInventoryItem) throw new NotFoundException('Blood item not found');

    //     const { donation, donationEvent } = existingInventoryItem.bloodBag;

    //     for (const bloodItem of bloodrequest.bloodItems) {
    //         const createdBloodInventoryItem = this.bloodInventoryRepo.create({
    //             bloodBag: donation.bloodBag,
    //             bloodType: bloodrequest.bloodType,
    //             branch,
    //             date: new Date().toISOString(),
    //             rhFactor: bloodrequest.rhFactor,
    //             source: donationEvent?.name,
    //             destination: bloodrequest.hospitalName,
    //             price: 0,
    //             status: BloodInventoryStatus.USABLE,
    //             expiry: new Date(Date.now() + CONSTANTS.BLOOD_EXPIRY_INTERVAL).toISOString(),
    //             transactionType: InventoryTransaction.ISSUED,
    //             component: bloodItem,
    //         })

    //         await this.bloodInventoryRepo.save(createdBloodInventoryItem)
    //     }

    // }
}
