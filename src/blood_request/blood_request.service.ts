import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBloodRequestDto } from './dto/create-blood_request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood_request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood_request.entity';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { Deleted } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { BloodRequestQueryDto } from './dto/blood-request-query.dto';
import { BloodInventoryService } from 'src/inventory/blood-inventory.service';
import getFileName from 'src/core/utils/getImageUrl';
import { RequestUser } from 'src/core/types/global.types';
import { BranchService } from 'src/branch/branch.service';

@Injectable()
export class BloodRequestService {
  constructor(
    @InjectRepository(BloodRequest) private readonly bloodRequestRepo: Repository<BloodRequest>,
    private readonly bloodInventoryService: BloodInventoryService,
    private readonly branchService: BranchService,
  ) { }

  async create(createBloodRequestDto: CreateBloodRequestDto, currentUser: RequestUser) {
    const branch = await this.branchService.findOne(currentUser.branchId);

    const { bloodType, rhFactor, bloodItems } = createBloodRequestDto;
    const existingBloodItem = await this.bloodInventoryService.checkIfBloodAvailable(bloodType, rhFactor, bloodItems, currentUser); // check if blood is available

    const documentFront = getFileName(createBloodRequestDto.documentFront);
    const documentBack = getFileName(createBloodRequestDto.documentBack);

    const createdRequest = this.bloodRequestRepo.create({
      ...createBloodRequestDto,
      documentFront,
      documentBack,
    });

    await this.bloodInventoryService.removeBloodItemFromInventory(existingBloodItem.id, branch, createdRequest); // remove blood item from inventory after beign request

    return await this.bloodRequestRepo.save(createdRequest);
  }

  async findAll(queryDto: BloodRequestQueryDto) {
    const queryBuilder = this.bloodRequestRepo.createQueryBuilder('bloodRequest');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("bloodRequest.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.where([
          { patientName: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        queryDto.bloodType && qb.andWhere({ bloodType: queryDto.bloodType });
        queryDto.rhFactor && qb.andWhere({ rhFactor: queryDto.rhFactor })
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingRequest = await this.bloodRequestRepo.findOneBy({ id });
    if (!existingRequest) throw new BadRequestException('Request not found');

    return existingRequest;
  }

  async update(id: string, updateBloodRequestDto: UpdateBloodRequestDto) {
    const { bloodType, rhFactor, bloodItems } = updateBloodRequestDto;
    // await this.bloodInventoryService.checkIfBloodAvailable(bloodType, rhFactor, bloodItems); // check if blood is available

    const existingRequest = await this.findOne(id);
    Object.assign(existingRequest, updateBloodRequestDto);

    return await this.bloodRequestRepo.save(existingRequest);
  }

  async remove(ids: string[]) {
    const foundBloodRequests = await this.bloodRequestRepo.find({
      where: {
        id: In(ids)
      }
    })
    await this.bloodRequestRepo.softRemove(foundBloodRequests);

    return {
      success: true,
      message: 'Blood Requests deleted successfully',
    }
  }

  async restore(ids: string[]) {
    const existingBloodRequests = await this.bloodRequestRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingBloodRequests) throw new BadRequestException('Blood Request not found');

    return await this.bloodRequestRepo.restore(ids);
  }

  async clearTrash() {
    return await this.bloodRequestRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
