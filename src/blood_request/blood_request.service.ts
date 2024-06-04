import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBloodRequestDto } from './dto/create-blood_request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood_request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood_request.entity';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { BloodRequestQueryDto } from './dto/blood-request-query.dto';

@Injectable()
export class BloodRequestService {
  constructor(
    @InjectRepository(BloodRequest) private readonly bloodRequestRepo: Repository<BloodRequest>,
  ) { }

  async create(createBloodRequestDto: CreateBloodRequestDto) {
    const createdRequest = this.bloodRequestRepo.create(createBloodRequestDto);

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
          // { firstName: ILike(`%${queryDto.search ?? ''}%`) },
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
