import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, IsNull, Not, Or, Repository } from 'typeorm';
import { BloodInventory } from './entities/blood_inventory.entity';
import { CreateBloodInventoryDto } from './dto/create-blood_inventory.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { BloodBagsService } from 'src/blood-bags/blood-bags.service';
import { Deleted } from 'src/core/dto/queryDto';
import { RequestUser } from 'src/core/types/global.types';
import { BranchService } from 'src/branch/branch.service';
import { BloodInventoryQueryDto } from './dto/blood-inventory-query.dto';
import { BloodInventoryStatus, InventoryTransaction } from 'src/core/types/fieldsEnum.types';
import { Branch } from 'src/branch/entities/branch.entity';
import { BloodRequest } from 'src/blood_request/entities/blood_request.entity';
import { CONSTANTS } from 'src/CONSTANTS';
import { CreateBloodRequestDto } from 'src/blood_request/dto/create-blood_request.dto';
import { RequestedBloodBag } from 'src/blood_request/entities/requestedBloodBag.entity';

@Injectable()
export class BloodInventoryService {
    constructor(
        @InjectRepository(BloodInventory) private readonly bloodInventoryRepo: Repository<BloodInventory>,
        @Inject(forwardRef(() => BloodBagsService)) private readonly bloodBagService: BloodBagsService,
        @InjectRepository(RequestedBloodBag) private readonly requestedBloodBagRepo: Repository<RequestedBloodBag>,
        private readonly branchService: BranchService,
    ) { }

    async create(createBloodInventoryDto: CreateBloodInventoryDto, currentUser: RequestUser) {
        // if bloodbagId is supplied then check if it exists, else create from bloodBagNo and bagTypeId
        if (!createBloodInventoryDto.bloodBagId && !createBloodInventoryDto.bloodBagNo && !createBloodInventoryDto.bagTypeId) {
            throw new BadRequestException('Please provide either bloodBagId or bloodBagNo and bagTypeId');
        }
        const bloodBag = createBloodInventoryDto.bloodBagId ?
            await this.bloodBagService.findOne(createBloodInventoryDto.bloodBagId) :
            await this.bloodBagService.create({
                bagNo: createBloodInventoryDto.bloodBagNo,
                bagType: createBloodInventoryDto.bagTypeId,
            })

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

    async checkIfBloodAvailable(createBloodRequestDto: CreateBloodRequestDto, currentUser: RequestUser) {
        const { bloodType, rhFactor, requestedComponents } = createBloodRequestDto;

        for (const requestedComponent of requestedComponents) {
            const existingBloodItem = await this.bloodInventoryRepo.find({
                relations: { branch: true },
                where: {
                    branch: { id: currentUser.branchId },
                    component: requestedComponent.componentName,
                    status: BloodInventoryStatus.USABLE,
                    bloodType,
                    rhFactor,
                    transactionType: InventoryTransaction.ISSUED
                }
            })

            if (existingBloodItem?.length < +requestedComponent.quantity) {
                throw new BadRequestException(`Insuffient ${requestedComponent.componentName}. Available: ${existingBloodItem?.length}`);
            }
        }

        return true;
    }

    async createRequestedBloodBagsAndCreateIssueStatementInInventory(bloodRequest: BloodRequest, bloodRequestDto: CreateBloodRequestDto, currentUser: RequestUser, branch: Branch) {
        const { bloodType, rhFactor } = bloodRequestDto;

        for (const requestedComponent of bloodRequestDto.requestedComponents) {
            for (let i = 0; i < +requestedComponent.quantity; i++) {
                const foundInventory = await this.bloodInventoryRepo.findOne({
                    relations: { branch: true, bloodBag: true },
                    where: {
                        branch: { id: currentUser.branchId },
                        component: requestedComponent.componentName,
                        status: BloodInventoryStatus.USABLE,
                        bloodType,
                        rhFactor,
                        transactionType: InventoryTransaction.ISSUED
                    },
                    order: { createdAt: 'DESC' },
                })

                const createdRequestedBloodBag = this.requestedBloodBagRepo.create({
                    bloodRequest,
                    bloodBag: foundInventory.bloodBag,
                })

                await this.requestedBloodBagRepo.save(createdRequestedBloodBag);


                // create issue statement
                const createdBloodInventoryIssueStatement = this.bloodInventoryRepo.create({
                    bloodBag: foundInventory.bloodBag,
                    bloodType: bloodType,
                    branch,
                    date: new Date().toISOString(),
                    rhFactor: rhFactor,
                    source: CONSTANTS.SELF,
                    destination: bloodRequest.hospital?.name,
                    price: 0,
                    status: BloodInventoryStatus.USED,
                    expiry: new Date(Date.now() + CONSTANTS.BLOOD_EXPIRY_INTERVAL).toISOString(),
                    transactionType: InventoryTransaction.ISSUED,
                    component: requestedComponent.componentName,
                })

                await this.bloodInventoryRepo.save(createdBloodInventoryIssueStatement)
            }
        }
    }
}
