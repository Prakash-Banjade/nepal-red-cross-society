import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Brackets, In, IsNull, Not, Or, Repository } from 'typeorm';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { RequestUser } from 'src/core/types/global.types';
import { BranchService } from 'src/branch/branch.service';
import { CONSTANTS } from 'src/CONSTANTS';
import { BloodBagStatus } from 'src/core/types/fieldsEnum.types';

@Injectable()
export class InventoryService {

  constructor(
    @InjectRepository(Inventory) private readonly inventoryRepo: Repository<Inventory>,
    private readonly branchService: BranchService,
  ) { }

  async create(createInventoryDto: CreateInventoryDto, currentUser: RequestUser) {
    const existingInventoryWithSameName = await this.getInventoryByName(createInventoryDto.name, currentUser);
    if (existingInventoryWithSameName) throw new BadRequestException('Inventory with same name already exists');

    const branch = await this.branchService.findOne(currentUser.branchId);

    const inventory = this.inventoryRepo.create({
      ...createInventoryDto,
      branch
    });
    return await this.inventoryRepo.save(inventory);
  }

  async findAll(queryDto: QueryDto, currentUser: RequestUser) {
    const branch = await this.branchService.findOne(currentUser.branchId);

    const queryBuilder = this.inventoryRepo.createQueryBuilder('inventory');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("inventory.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.andWhere({ branch }) // filter by branch
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string, currentUser: RequestUser) {
    const branch = await this.branchService.findOne(currentUser.branchId);

    const existingInventory = await this.inventoryRepo.findOne({
      where: { id, branch: { id: branch.id } },
      relations: { items: true },
      order: {
        items: {
          createdAt: 'DESC'
        }
      }
    })
    if (!existingInventory) throw new NotFoundException('Inventory not found');

    return {
      ...existingInventory,
      quantity: existingInventory.quantity,
      bloodBagCount: existingInventory.bloodBagCount
    };
  }

  async getInventoryByName(name: string, currentUser: RequestUser): Promise<Inventory> {
    const branch = await this.branchService.findOne(currentUser.branchId);
    const inventory = await this.inventoryRepo.findOne({
      where: { name, branch: { id: branch.id } },
      relations: { items: true },
    })

    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory
  }

  async checkSufficientBloodBags(requiredBloodBags: Record<string, number>[], currentUser: RequestUser) {
    const inventory = await this.getInventoryByName(CONSTANTS.BLOOD_BAG, currentUser)

    const bloodBagCount = inventory.bloodBagCount;

    for (const [key, value] of Object.entries(requiredBloodBags)) {
      if (!bloodBagCount[key][BloodBagStatus.USABLE] || bloodBagCount[key][BloodBagStatus.USABLE] < value) throw new BadRequestException('Not enough blood bags of type ' + key);
    }

    return inventory.id
  }

  async checkSufficientInventoryItemsByInventoryName(inventoryName: string, currentUser: RequestUser) {
    const inventory = await this.getInventoryByName(inventoryName, currentUser)

    if (inventory.quantity < 1) throw new BadRequestException('Not enough inventory items');
    return inventory.id
  }


  async update(id: string, updateInventoryDto: UpdateInventoryDto, currentUser: RequestUser) {
    const existingInventory = await this.findOne(id, currentUser);

    Object.assign(existingInventory, updateInventoryDto);

    return await this.inventoryRepo.save(existingInventory);
  }

  async remove(ids: string[], currentUser: RequestUser) {
    const branch = await this.branchService.findOne(currentUser.branchId);

    const existingInventory = await this.inventoryRepo.find({
      where: {
        id: In(ids),
        branch,
      },
    });
    await this.inventoryRepo.softRemove(existingInventory);

    return {
      success: true,
      message: 'Inventory removed',
    }
  }

  async restore(ids: string[], currentUser: RequestUser) {
    const branch = await this.branchService.findOne(currentUser.branchId);

    const existingInventory = await this.inventoryRepo.find({
      where: { id: In(ids), branch },
      withDeleted: true,
    })
    if (!existingInventory) throw new BadRequestException('Inventory not found');

    return await this.inventoryRepo.restore(ids);
  }

  async clearTrash(currentUser: RequestUser) {
    const branch = await this.branchService.findOne(currentUser.branchId);

    return await this.inventoryRepo.delete({
      deletedAt: Not(IsNull()),
      branch
    })
  }
}
