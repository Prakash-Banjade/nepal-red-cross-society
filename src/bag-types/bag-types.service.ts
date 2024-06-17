import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBagTypeDto } from './dto/create-bag-type.dto';
import { UpdateBagTypeDto } from './dto/update-bag-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BagType } from './entities/bag-type.entity';
import { ILike, Repository } from 'typeorm';
import { BloodComponent } from './entities/blood-component.entity';

@Injectable()
export class BagTypesService {
  constructor(
    @InjectRepository(BagType) private readonly bagTypeRepo: Repository<BagType>,
    @InjectRepository(BloodComponent) private readonly bloodComponentRepo: Repository<BloodComponent>,
  ) { }

  async create(createBagTypeDto: CreateBagTypeDto) {
    const existingBagTypeWithSameName = await this.bagTypeRepo.findOne({ where: { name: createBagTypeDto.name } });
    if (existingBagTypeWithSameName) throw new BadRequestException('Bag type with same name already exists');

    const savedBagType = await this.bagTypeRepo.save({ name: createBagTypeDto.name });

    // create blood components
    const createdComponents: string[] = [] // keeping track of created component to avoid duplicates
    for (const component of createBagTypeDto.bloodComponents) {
      if (createdComponents.includes(component.componentName)) continue;

      const bloodComponent = this.bloodComponentRepo.create({
        ...component,
        bagType: savedBagType,
      });

      await this.bloodComponentRepo.save(bloodComponent);

      createdComponents.push(component.componentName);
    }

    return savedBagType;
  }

  async findAll() {
    return await this.bagTypeRepo.find({
      relations: ['bloodComponents'],
    });
  }

  async findOne(id: string) {
    const existing = await this.bagTypeRepo.findOne({ where: { id }, relations: ['bloodComponents'] });

    if (!existing) throw new BadRequestException('Bag type not found');

    return existing;
  }

  async getBloodComponents() {
    const components = await this.bloodComponentRepo.find({ select: { componentName: true } });
    return Array.from(new Set(components.map((component) => component.componentName)));
  }

  async findBagTypeByName(name: string) {
    const existing = await this.bagTypeRepo.findOne({ where: { name: ILike(`%${name}%`) }, relations: ['bloodComponents'] });

    if (!existing) throw new BadRequestException('Invalid Bag type name');

    return existing;
  }

  async update(id: string, updateBagTypeDto: UpdateBagTypeDto) {
    const existing = await this.findOne(id);

    Object.assign(existing, updateBagTypeDto);

    const savedBagType = await this.bagTypeRepo.save(existing);

    const createdComponents: string[] = [] // keeping track of created component to avoid duplicates

    // update blood components
    for (const component of updateBagTypeDto.bloodComponents) {
      if (createdComponents.includes(component.componentName)) continue;

      const existingComponent = await this.bloodComponentRepo.findOne({ where: { componentName: component.componentName, bagType: { id: savedBagType.id } } });
      if (!existingComponent) {
        const bloodComponent = this.bloodComponentRepo.create({
          ...component,
          bagType: savedBagType,
        });

        await this.bloodComponentRepo.save(bloodComponent);
      } else {
        Object.assign(existingComponent, component);
        await this.bloodComponentRepo.save(existingComponent);
      }

      createdComponents.push(component.componentName);
    }

    return savedBagType;
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    return await this.bagTypeRepo.remove(existing);
  }
}
