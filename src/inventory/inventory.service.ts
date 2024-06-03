import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { In, IsNull, Not, Or, Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class InventoryService {

  constructor(
    @InjectRepository(Inventory) private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(InventoryItem) private readonly inventoryItemRepo: Repository<InventoryItem>,
  ) { }

  async create(createInventoryDto: CreateInventoryDto) {
    const inventory = this.inventoryRepo.create(createInventoryDto);
    return await this.inventoryRepo.save(inventory);
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.inventoryRepo.createQueryBuilder('donor');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("donor.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingInventory = await this.inventoryRepo.findOne({
      where: { id },
    })
    if (!existingInventory) throw new NotFoundException('Inventory not found');

    return existingInventory;
  }

  async update(id: string, updateInventoryDto: UpdateInventoryDto) {
    const existingInventory = await this.findOne(id);

    Object.assign(existingInventory, updateInventoryDto);

    return await this.inventoryRepo.save(existingInventory);
  }

  async remove(ids: string[]) {
    const existingItem = await this.inventoryRepo.find({
      where: {
        id: In(ids)
      },
    });
    await this.inventoryRepo.softRemove(existingItem);

    return {
      success: true,
      message: 'Donors removed',
    }
  }

  async restore(ids: string[]) {
    const existingItem = await this.inventoryRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingItem) throw new BadRequestException('Item not found');

    return await this.inventoryRepo.restore(ids);
  }

  async clearTrash() {
    return await this.inventoryRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
