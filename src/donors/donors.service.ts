import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Donor } from './entities/donor.entity';
import { Repository } from 'typeorm';
import { AddressService } from 'src/address/address.service';
import { UpdateAddressDto } from 'src/address/dto/update-address.dto';
import getFileName from 'src/core/utils/getImageUrl';

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(Donor) private donorRepo: Repository<Donor>,
    private readonly addressService: AddressService,
  ) { }

  async create(createDonorDto: CreateDonorDto) {
    const existingDonor = await this.donorRepo.findOneBy({ email: createDonorDto.email });
    if (existingDonor) throw new BadRequestException('Donor with this email already exists');

    // evaluating address
    const address = await this.addressService.create(this.extractAddress(createDonorDto));

    // getting image pathname
    const image = getFileName(createDonorDto.image);

    const donor = this.donorRepo.create({
      ...createDonorDto,
      address,
      image, // TODO: implement image upload
    });

    address.donor = donor;

    return await this.donorRepo.save(donor);
  }

  async findAll() {
    return await this.donorRepo.find();
  }

  async findOne(id: string) {
    const existingDonor = await this.donorRepo.findOne({
      where: { id },
      relations: { address: true },
    });
    if (!existingDonor) throw new BadRequestException('Donor not found');
    return existingDonor;
  }

  async update(id: string, updateDonorDto: UpdateDonorDto) {
    const existingDonor = await this.findOne(id);

    // setting if address is updated
    updateDonorDto.country && await this.addressService.update(existingDonor.address.id, this.extractAddress(updateDonorDto))

    // setting if image is updated
    updateDonorDto.image && (existingDonor.image = getFileName(updateDonorDto.image));

    Object.assign(existingDonor, {
      ...updateDonorDto,
      image: existingDonor.image,
    });

    await this.donorRepo.save(existingDonor);

    return {
      success: true,
      message: 'Donor updated',
    }
  }

  async remove(id: string) {
    const existingDonor = await this.findOne(id);
    return await this.donorRepo.remove(existingDonor);
  }

  public extractAddress(dto: CreateDonorDto | UpdateAddressDto) {
    const { country, province, district, municipality, ward, street } = dto;
    return { country, province, district, municipality, ward, street };
  }
}
