import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBloodBagDto } from './dto/create-blood-bag.dto';
import { UpdateBloodBagDto } from './dto/update-blood-bag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BloodBag } from './entities/blood-bag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BloodBagsService {

  constructor(
    @InjectRepository(BloodBag) private bloodBagsRepository: Repository<BloodBag>,
  ) { }
  async create(createBloodBagDto: CreateBloodBagDto) {
    const existignBloodBagWithSameNo = await this.bloodBagsRepository.findOneBy({ bagNo: createBloodBagDto.bagNo });
    if (existignBloodBagWithSameNo) throw new BadRequestException('Blood bag with same number already exists');

    return await this.bloodBagsRepository.save(createBloodBagDto);
  }

  async createBloodBagsInBulk(quantity: number) {
    const lastBloodBag = await this.bloodBagsRepository.findOne({ order: { bagNo: 'DESC' } });

    let lastBloodBagNo = lastBloodBag ? lastBloodBag.bagNo : 1;
    for (let i = 0; i < quantity; i++) {
      const bagNo = lastBloodBagNo + i;

      const newBloodBag = this.bloodBagsRepository.create({ bagNo });
      await this.bloodBagsRepository.save(newBloodBag);
    }

  }

  async findAll() {
    return await this.bloodBagsRepository.find();
  }

  async findOne(id: string) {
    const existingBloodBag = await this.bloodBagsRepository.findOneBy({ id });
    if (!existingBloodBag) throw new BadRequestException('Blood bag not found');

    return existingBloodBag;
  }

  async update(id: string, updateBloodBagDto: UpdateBloodBagDto) {
    return `This action updates a #${id} bloodBag`;
  }

  async remove(id: string) {
    return `This action removes a #${id} bloodBag`;
  }
}
