import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceChargeDto } from './dto/create-service-charge.dto';
import { UpdateServiceChargeDto } from './dto/update-service-charge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceCharge } from './entities/service-charge.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ServiceChargeService {
  constructor(
    @InjectRepository(ServiceCharge) private readonly serviceChargeRepo: Repository<ServiceCharge>
  ) { }

  async create(createServiceChargeDto: CreateServiceChargeDto) {
    const existingServiceChargeWithSameName = await this.serviceChargeRepo.findOne({
      where: {
        particular: createServiceChargeDto.particular
      }
    })

    if (existingServiceChargeWithSameName) throw new BadRequestException('Service charge with same name already exists')

    const serviceCharge = this.serviceChargeRepo.create(createServiceChargeDto);
    return await this.serviceChargeRepo.save(serviceCharge);
  }

  async findAll() {
    return await this.serviceChargeRepo.find();
  }

  async findOne(id: string) {
    const existingServiceCharge = await this.serviceChargeRepo.findOne({ where: { id } })
    if (!existingServiceCharge) throw new BadRequestException('Service charge not found')

    return existingServiceCharge
  }

  async update(id: string, updateServiceChargeDto: UpdateServiceChargeDto) {
    const existingServiceCharge = await this.findOne(id)

    Object.assign(existingServiceCharge, updateServiceChargeDto)

    return await this.serviceChargeRepo.save(existingServiceCharge)
  }

  async remove(id: string) {
    const existingServiceCharge = await this.findOne(id)
    return await this.serviceChargeRepo.remove(existingServiceCharge)
  }
}
