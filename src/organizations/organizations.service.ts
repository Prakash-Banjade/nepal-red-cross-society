import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { In, Repository } from 'typeorm';
import { Donation } from 'src/donations/entities/donation.entity';
import { Address } from 'src/address/entities/address.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private organizationRepo: Repository<Organization>,
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
  ) { }

  async create(createOrganizationDto: CreateOrganizationDto) {
    const foundOrganizationWithSameName = await this.organizationRepo.findOne({ where: { name: createOrganizationDto.name } });
    if (foundOrganizationWithSameName) throw new BadRequestException('Organization with this name already exists');

    // evaluating address
    const { province, district, municipality, ward, street } = createOrganizationDto;
    const address = this.addressRepo.create({ province, district, municipality, ward, street });

    const createdOrganization = this.organizationRepo.create({
      ...createOrganizationDto,
      address,
    });

    return await this.organizationRepo.save(createdOrganization);
  }

  async findAll() {
    return await this.organizationRepo.find();
  }

  async findOne(id: string) {
    const foundOrganization = await this.organizationRepo.findOneBy({ id });
    if (!foundOrganization) throw new BadRequestException('Organization not found');
    return foundOrganization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const foundOrganization = await this.findOne(id);

    // retrieving donations
    const donations = updateOrganizationDto.donations.length ? await this.donationRepo.find({
      where: {
        id: In(updateOrganizationDto.donations)
      }
    }) : null;

    Object.assign(foundOrganization, {
      ...updateOrganizationDto,
      donations
    })

    return await this.organizationRepo.save(foundOrganization);
  }

  async remove(id: string) {
    const foundOrganization = await this.findOne(id);
    return await this.organizationRepo.softRemove(foundOrganization);
  }
}
