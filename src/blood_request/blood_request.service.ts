import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBloodRequestDto } from './dto/create-blood_request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood_request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood_request.entity';
import { In, IsNull, Not, Or, Repository } from 'typeorm';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class BloodRequestService {
  constructor(
    @InjectRepository(BloodRequest) private readonly volunteerRepo: Repository<BloodRequest>,
  ) { }

  async create(createBloodRequestDto: CreateBloodRequestDto) {
    const createdRequest = this.volunteerRepo.create(createBloodRequestDto);

    return await this.volunteerRepo.save(createdRequest);
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.volunteerRepo.createQueryBuilder('volunteer');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("volunteer.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.page)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingRequest = await this.volunteerRepo.findOneBy({ id });
    if (!existingRequest) throw new BadRequestException('Request not found');

    return existingRequest;
  }

  async update(id: string, updateBloodRequestDto: UpdateBloodRequestDto) {
    const existingRequest = await this.findOne(id);
    Object.assign(existingRequest, updateBloodRequestDto);

    return await this.volunteerRepo.save(existingRequest);
  }

  async remove(ids: string[]) {
    const foundVolunteers = await this.volunteerRepo.find({
      where: {
        id: In(ids)
      }
    })
    await this.volunteerRepo.softRemove(foundVolunteers);

    return {
      success: true,
      message: 'Volunteers deleted successfully',
    }
  }

  async restore(ids: string[]) {
    const existingVolunteers = await this.volunteerRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingVolunteers) throw new BadRequestException('Volunteer not found');

    return await this.volunteerRepo.restore(ids);
  }

  async clearTrash() {
    return await this.volunteerRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
