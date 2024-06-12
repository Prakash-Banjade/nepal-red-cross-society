import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBagTypeDto } from './dto/create-bag-type.dto';
import { UpdateBagTypeDto } from './dto/update-bag-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BagType } from './entities/bag-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BagTypesService {
  constructor(
    @InjectRepository(BagType) private readonly bagTypeRepo: Repository<BagType>,
  ) { }

  async create(createBagTypeDto: CreateBagTypeDto) {
    const existingBagTypeWithSameName = await this.bagTypeRepo.findOne({ where: { name: createBagTypeDto.name } });
    if (existingBagTypeWithSameName) return new BadRequestException('Bag type with same name already exists');

    const bagType = this.bagTypeRepo.create(createBagTypeDto);
    return await this.bagTypeRepo.save(bagType);
  }

  async findAll() {
    return await this.bagTypeRepo.find();
  }

  async findOne(id: string) {
    const existing = await this.bagTypeRepo.findOne({ where: { id } });

    if (!existing) throw new BadRequestException('Bag type not found');

    return existing;
  }

  async update(id: string, updateBagTypeDto: UpdateBagTypeDto) {
    const existing = await this.findOne(id);

    Object.assign(existing, updateBagTypeDto);

    return await this.bagTypeRepo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    return await this.bagTypeRepo.remove(existing);
  }
}
