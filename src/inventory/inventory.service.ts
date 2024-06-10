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

@Injectable()
export class InventoryService {

  constructor(
    @InjectRepository(Inventory) private readonly inventoryRepo: Repository<Inventory>,
    private readonly branchService: BranchService,
  ) { }

  async create(createInventoryDto: CreateInventoryDto, currentUser: RequestUser) {
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
    })
    if (!existingInventory) throw new NotFoundException('Inventory not found');

    return {
      ...existingInventory,
      quantity: existingInventory.quantity
    };
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
