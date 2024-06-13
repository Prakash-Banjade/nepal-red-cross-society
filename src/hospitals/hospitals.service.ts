import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from './entities/hospital.entity';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { extractAddress } from 'src/core/utils/extractAddress';
import { AddressService } from 'src/address/address.service';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import { HospitalQueryDto } from './dto/hospital-query.dto';
import paginatedData from 'src/core/utils/paginatedData';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital) private hospitalRepo: Repository<Hospital>,
    private readonly addressService: AddressService
  ) { }

  async create(createHospitalDto: CreateHospitalDto) {
    // evaluate address
    const address = await this.addressService.create(extractAddress(createHospitalDto));

    const createdHospital = this.hospitalRepo.create({
      ...createHospitalDto,
      address
    });
    return this.hospitalRepo.save(createdHospital);
  }

  async findAll(queryDto: HospitalQueryDto) {
    const queryBuilder = this.hospitalRepo.createQueryBuilder('hospital');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("hospital.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.where([
          { name: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
      }))
      .leftJoinAndSelect('hospital.address', 'address')
      .andWhere(new Brackets(qb => {
        if (queryDto.country) qb.andWhere("LOWER(address.country) LIKE LOWER(:country)", { country: `%${queryDto.country ?? ''}%` });
        if (queryDto.province) qb.andWhere("LOWER(address.province) LIKE LOWER(:province)", { province: `%${queryDto.province ?? ''}%` });
        if (queryDto.district) qb.andWhere("LOWER(address.district) LIKE LOWER(:district)", { district: `%${queryDto.district ?? ''}%` });
        if (queryDto.municipality) qb.andWhere("LOWER(address.municipality) LIKE LOWER(:municipality)", { municipality: `%${queryDto.municipality ?? ''}%` });
        if (queryDto.ward) qb.andWhere("LOWER(address.ward) LIKE LOWER(:ward)", { ward: `%${queryDto.ward ?? ''}%` });
        if (queryDto.street) qb.andWhere("LOWER(address.street) LIKE LOWER(:street)", { street: `%${queryDto.street ?? ''}%` });
      }))

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existing = await this.hospitalRepo.findOne({ where: { id }, relations: ['address'] });
    if (!existing) throw new NotFoundException('Hospital not found');
    return existing;
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto) {
    const existingHospital = await this.findOne(id);
    updateHospitalDto.country && await this.addressService.update(existingHospital.address.id, extractAddress(updateHospitalDto))

    Object.assign(existingHospital, updateHospitalDto);
    return await this.hospitalRepo.save(existingHospital);
  }

  async remove(ids: string[]) {
    const existingHospitals = await this.hospitalRepo.find({
      where: {
        id: In(ids)
      },
    });
    await this.hospitalRepo.softRemove(existingHospitals);

    return {
      success: true,
      message: 'Hospitals removed',
    }
  }

  async restore(ids: string[]) {
    const existingHospitals = await this.hospitalRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingHospitals) throw new BadRequestException('Hospital not found');

    return await this.hospitalRepo.restore(ids);
  }

  async clearTrash() {
    return await this.hospitalRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
