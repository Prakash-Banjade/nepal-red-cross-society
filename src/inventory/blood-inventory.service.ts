import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { BloodInventory } from './entities/blood_inventory.entity';
import { AvailableInventoryDto, BloodInventoryIssueDto, CreateBloodInventoryDto } from './dto/create-blood_inventory.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { BloodBagsService } from 'src/blood-bags/blood-bags.service';
import { Deleted } from 'src/core/dto/queryDto';
import { RequestUser } from 'src/core/types/global.types';
import { BranchService } from 'src/branch/branch.service';
import { BloodInventoryQueryDto } from './dto/blood-inventory-query.dto';
import { BloodInventoryStatus, BloodType, InventoryTransaction, RhFactor } from 'src/core/types/fieldsEnum.types';
import { Branch } from 'src/branch/entities/branch.entity';
import { BloodRequest } from 'src/blood_request/entities/blood_request.entity';
import { CONSTANTS, initialBloodInventoryCount } from 'src/CONSTANTS';
import { CreateBloodRequestDto } from 'src/blood_request/dto/create-blood_request.dto';
import { RequestedBloodBag } from 'src/blood_request/entities/requestedBloodBag.entity';
import { BagTypesService } from 'src/bag-types/bag-types.service';
import { BloodInventoryRepository } from './repository/blood-inventory.repository';

@Injectable()
export class BloodInventoryService {
    constructor(
        @InjectRepository(BloodInventory) private readonly bloodInventoryRepo: Repository<BloodInventory>,
        @Inject(forwardRef(() => BloodBagsService)) private readonly bloodBagService: BloodBagsService,
        @InjectRepository(RequestedBloodBag) private readonly requestedBloodBagRepo: Repository<RequestedBloodBag>,
        private readonly branchService: BranchService,
        private readonly bagTypeService: BagTypesService,
        private readonly bloodInventoryRepository: BloodInventoryRepository,
    ) { }

    // this one is for automated ones
    async create(createBloodInventoryDto: CreateBloodInventoryDto, currentUser: RequestUser) {
        // if bloodbagId is supplied then check if it exists, else create from bloodBagNo and bagTypeId
        if (!createBloodInventoryDto.bloodBagId && !createBloodInventoryDto.bagTypeId) {
            throw new BadRequestException('Please provide either bloodBagId or bloodBagNo and bagTypeId');
        }

        const branch = await this.branchService.findOne(currentUser.branchId);

        createBloodInventoryDto.transactionType === InventoryTransaction.ISSUED && await this.checkIfBloodAvailableToIssue(createBloodInventoryDto, branch);

        const bloodBag = createBloodInventoryDto.bloodBagId ?
            await this.bloodBagService.findOne(createBloodInventoryDto.bloodBagId) :
            await this.bloodBagService.create({
                // bagNo: createBloodInventoryDto.bloodBagNo,
                bagType: createBloodInventoryDto.bagTypeId,
            }, currentUser);


        const bloodInventoryItem = this.bloodInventoryRepo.create({
            ...createBloodInventoryDto,
            bloodBag: 'bloodBag' in bloodBag ? bloodBag.bloodBag : bloodBag,
            branch,
            expiry: new Date(Date.now() + (createBloodInventoryDto.expiry * 24 * 60 * 60 * 1000)).toISOString(),
        });

        const newBloodInventory = await this.bloodInventoryRepository.saveBloodInventory(bloodInventoryItem); // TRANSACTION

        return newBloodInventory
    }

    async createIssueStatements(bloodInventoryIssueDto: BloodInventoryIssueDto, currentUser: RequestUser) {
        const { inventoryIds, date, source, destination, price } = bloodInventoryIssueDto;

        for (const inventoryId of inventoryIds) {
            const inventory = await this.findOne(inventoryId, currentUser);

            delete inventory.id;
            delete inventory.createdAt
            delete inventory.updatedAt

            const issueStatement = this.bloodInventoryRepo.create({
                ...inventory,
                transactionType: InventoryTransaction.ISSUED,
                bloodBag: inventory.bloodBag,
                date,
                source,
                destination,
                price
            })

            await this.bloodInventoryRepository.saveBloodInventory(issueStatement); // TRANSACTION
        }

        return {
            message: 'Blood items successfully issued',
        }
    }

    async getAvailableBloodInventory(availableInventoryDto: AvailableInventoryDto, currentUser: RequestUser) {
        const { component, bloodType, rhFactor } = availableInventoryDto;
        if (!component || !bloodType || !rhFactor) return []

        // First, fetch the issued statements with the blood bag numbers
        // First, fetch the issued blood bag numbers
        const issuedBloodBagNumbers = await this.bloodInventoryRepo.createQueryBuilder("bloodInventory")
            .leftJoinAndSelect("bloodInventory.bloodBag", "bloodBag")
            .leftJoinAndSelect("bloodInventory.branch", "branch")
            .where("branch.id = :branchId", { branchId: currentUser.branchId })
            .andWhere(new Brackets(qb => {
                qb.andWhere({ component: ILike(component) })
                qb.andWhere({ status: BloodInventoryStatus.USABLE })
                qb.andWhere({ transactionType: InventoryTransaction.ISSUED })
                qb.andWhere({ bloodType })
                qb.andWhere({ rhFactor })
            }))
            .getMany();

        const issuedBloodBagNumbersArray = issuedBloodBagNumbers.map(item => item.bloodBag.bagNo);

        // Now, fetch the received statements, handling the case when the array is empty
        let receivedStatementsQuery = this.bloodInventoryRepo.createQueryBuilder("bloodInventory")
            .leftJoinAndSelect("bloodInventory.bloodBag", "bloodBag")
            .leftJoinAndSelect("bloodBag.bagType", "bagType")
            .leftJoinAndSelect("bloodInventory.branch", "branch")
            .where("branch.id = :branchId", { branchId: currentUser.branchId })
            .andWhere(new Brackets(qb => {
                qb.andWhere({ component: ILike(component) })
                qb.andWhere({ status: BloodInventoryStatus.USABLE })
                qb.andWhere({ transactionType: InventoryTransaction.RECEIVED })
                qb.andWhere({ bloodType })
                qb.andWhere({ rhFactor })
            }));

        if (issuedBloodBagNumbersArray.length > 0) {
            receivedStatementsQuery = receivedStatementsQuery.andWhere("bloodBag.bagNo NOT IN (:...issuedBloodBagNumbers)", { issuedBloodBagNumbers: issuedBloodBagNumbersArray });
        }

        const receivedStatements = await receivedStatementsQuery.getMany();

        return receivedStatements
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
            .leftJoinAndSelect('bloodInventory.bloodBag', 'bloodBag')
            .leftJoinAndSelect('bloodBag.donation', 'donation')
            .leftJoinAndSelect('bloodBag.bagType', 'bagType')
            .andWhere(new Brackets(qb => {
                qb.andWhere({ branch: { id: currentUser.branchId } })
            }))
            .andWhere(new Brackets(qb => {
                queryDto.itemType && qb.andWhere({ itemType: queryDto.itemType });
                queryDto.component && qb.andWhere({ component: ILike(queryDto.component) });
                queryDto.status && qb.andWhere({ status: queryDto.status });
                queryDto.transactionType && qb.andWhere({ transactionType: queryDto.transactionType });
                queryDto.rhFactor && qb.andWhere({ rhFactor: queryDto.rhFactor });
                queryDto.bloodType && qb.andWhere({ bloodType: queryDto.bloodType });
            }))
            .andWhere(new Brackets(qb => {
                if (queryDto.search) qb.andWhere("LOWER(bloodBag.bagNo) LIKE LOWER(:bagNo)", { bagNo: `%${+queryDto.search ?? ''}%` });
                if (queryDto.bagType) qb.andWhere("LOWER(bagType.name) LIKE LOWER(:bagType)", { bagType: `%${queryDto.bagType ?? ''}%` });
            }))

        return paginatedData(queryDto, queryBuilder);
    }

    async findOne(id: string, currentUser: RequestUser) {
        const existingInventory = await this.bloodInventoryRepo.findOne({
            relations: { branch: true, bloodBag: true },
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

    async count(status: BloodInventoryStatus = BloodInventoryStatus.USABLE, currentUser: RequestUser) {
        let bloodCounts = initialBloodInventoryCount;
        const queryBuilder = this.bloodInventoryRepo.createQueryBuilder('bloodInventory');

        const componentNames = await this.bagTypeService.getBloodComponents();

        for (const bloodCount of bloodCounts) {
            const { bloodType, rhFactor } = bloodCount;

            for (const componentName of componentNames) {
                const availableCount = await queryBuilder
                    .select(`
              SUM(CASE WHEN bloodInventory.transactionType = :received THEN bloodInventory.quantity ELSE 0 END) -
              SUM(CASE WHEN bloodInventory.transactionType = :issued THEN bloodInventory.quantity ELSE 0 END) as available
            `)
                    .where({ branch: { id: currentUser.branchId } })
                    .andWhere(new Brackets(qb => {
                        qb.andWhere({ status: status ?? BloodInventoryStatus.USABLE });
                        qb.andWhere({ bloodType });
                        qb.andWhere({ component: componentName });
                        qb.andWhere({ rhFactor });
                    }))
                    .setParameters({
                        received: InventoryTransaction.RECEIVED,
                        issued: InventoryTransaction.ISSUED
                    })
                    .getRawOne();

                const available = availableCount.available as number;

                bloodCount.count[componentName] = available;
            }
        }

        return bloodCounts
    }

    async checkIfBloodAvailableForRequest(createBloodRequestDto: CreateBloodRequestDto, currentUser: RequestUser) {
        const { bloodType, rhFactor, inventoryIds } = createBloodRequestDto;

        for (const ivnentoryId of inventoryIds) {
            const existingBloodItem = await this.bloodInventoryRepo.find({
                relations: { branch: true },
                where: {
                    id: ivnentoryId,
                    branch: { id: currentUser.branchId },
                    status: BloodInventoryStatus.USABLE,
                    bloodType,
                    rhFactor,
                    transactionType: InventoryTransaction.RECEIVED
                },
            })

            if (!existingBloodItem) {
                throw new BadRequestException(`${bloodType} ${rhFactor} not available`);
            }
        }

        return true;
    }

    async checkIfBloodAvailableToIssue(createBloodInventoryDto: CreateBloodInventoryDto, branch: Branch) {
        const { bloodType, rhFactor, component, quantity, bagTypeId } = createBloodInventoryDto;

        // const existingBloodItems = await this.bloodInventoryRepo.find({
        //     relations: { branch: true },
        //     where: {
        //         branch: { id: branch.id },
        //         component: component,
        //         status: BloodInventoryStatus.USABLE,
        //         bloodType,
        //         rhFactor,
        //         transactionType: InventoryTransaction.ISSUED
        //     }
        // })

        const componentQuantity = await this.getSumOfQuantities(component, bloodType, rhFactor, branch.id);

        if (componentQuantity < +quantity) {
            throw new BadRequestException(`Insuffient ${component}. Available: ${componentQuantity}`);
        }

        return true;
    }


    async getSumOfQuantities(component: string, bloodType: BloodType, rhFactor: RhFactor, branchId: string): Promise<number> {
        // console.log(component, bloodType, rhFactor)
        console.log(rhFactor, bloodType)

        const issuedSum = await this.bloodInventoryRepo.createQueryBuilder("bloodInventory")
            .where("bloodInventory.branch.id = :branchId", { branchId })
            .andWhere(new Brackets(qb => {
                qb.andWhere({ component: ILike(component) })
                qb.andWhere({ status: BloodInventoryStatus.USABLE })
                qb.andWhere({ transactionType: InventoryTransaction.ISSUED })
                qb.andWhere({ bloodType })
                qb.andWhere({ rhFactor })
            }))
            .select("SUM(bloodInventory.quantity)", "sum")
            .getRawOne();

        const receivedSum = await this.bloodInventoryRepo.createQueryBuilder("bloodInventory")
            .where("bloodInventory.branch.id = :branchId", { branchId })
            .andWhere(new Brackets(qb => {
                qb.andWhere({ component: ILike(component) })
                qb.andWhere({ status: BloodInventoryStatus.USABLE })
                qb.andWhere({ transactionType: InventoryTransaction.RECEIVED })
                qb.andWhere({ bloodType })
                qb.andWhere({ rhFactor })
            }))
            .select("SUM(bloodInventory.quantity)", "sum")
            .getRawOne();

        return receivedSum.sum - issuedSum.sum;
    }
}
