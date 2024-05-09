import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Donor } from './entities/donor.entity';
import { Repository } from 'typeorm';
import { Address } from 'src/address/entities/address.entity';

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(Donor) private donorRepo: Repository<Donor>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
  ) { }

  async create(createDonorDto: CreateDonorDto) {
    const existingDonor = await this.donorRepo.findOneBy({ email: createDonorDto.email });
    if (existingDonor) throw new BadRequestException('Donor with this email already exists');

    // evaluating address
    const { province, district, municipality, ward, street } = createDonorDto;
    const address = this.addressRepo.create({ province, district, municipality, ward, street });

    const donor = this.donorRepo.create({
      ...createDonorDto,
      address,
    });

    address.donor = donor;
    await this.addressRepo.save(address);

    return await this.donorRepo.save(donor);
  }

  async findAll() {
    return await this.donorRepo.find();
  }

  async findOne(id: string) {
    const existingDonor = await this.donorRepo.findOneBy({ id });
    if (!existingDonor) throw new BadRequestException('Donor not found');
    return existingDonor;
  }

  async update(id: string, updateDonorDto: UpdateDonorDto) {
    const existingDonor = await this.findOne(id);

    // setting if address is updated
    updateDonorDto.province && await this.setAddress(existingDonor, updateDonorDto);

    Object.assign(existingDonor, {
      firstName: updateDonorDto.firstName,
      lastName: updateDonorDto.lastName,
      gender: updateDonorDto.gender,
      email: updateDonorDto.email,
      race: updateDonorDto.race,
      cast: updateDonorDto.cast,
      phone: updateDonorDto.phone,
      dob: updateDonorDto.dob,
      bloodType: updateDonorDto.bloodType,
      rhFactor: updateDonorDto.rhFactor,
    })

    return await this.donorRepo.save(existingDonor);
  }

  async remove(id: string) {
    const existingDonor = await this.findOne(id);
    return await this.donorRepo.remove(existingDonor);
  }

  async setAddress(donor: Donor, updateDonorDto: UpdateDonorDto) {
    const { country, province, district, municipality, ward, street } = updateDonorDto;

    const existingAddress = await this.addressRepo.findOneBy({ donor });
    if (!existingAddress) throw new BadRequestException('Address not found');

    existingAddress.country = country;
    existingAddress.province = province;
    existingAddress.district = district;
    existingAddress.municipality = municipality;
    existingAddress.ward = ward;
    existingAddress.street = street;

    await this.addressRepo.save(existingAddress);
  }
}
