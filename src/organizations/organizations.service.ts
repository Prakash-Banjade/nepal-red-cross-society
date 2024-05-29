import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { Donation } from 'src/donations/entities/donation.entity';
import getFileName from 'src/core/utils/getImageUrl';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { extractAddress } from 'src/core/utils/extractAddress';
import { AddressService } from 'src/address/address.service';
import { OrganizationQueryDto } from './dto/organization-query.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization) private organizationRepo: Repository<Organization>,
    @InjectRepository(Donation) private donationRepo: Repository<Donation>,
    private readonly addressService: AddressService,
  ) { }

  async create(createOrganizationDto: CreateOrganizationDto) {
    const foundOrganizationWithSameNameOrEmail = await this.organizationRepo.findOne({
      where: [
        { name: createOrganizationDto.name },
        { email: createOrganizationDto.email },
      ]
    });

    if (foundOrganizationWithSameNameOrEmail) throw new BadRequestException('Organization with this name or email already exists');

    // evaluating address
    const address = await this.addressService.create(extractAddress(createOrganizationDto));

    // evaluate logo
    const logo = createOrganizationDto.logo ? getFileName(createOrganizationDto.logo) : null;

    const createdOrganization = this.organizationRepo.create({
      ...createOrganizationDto,
      address,
      logo
    });

    return await this.organizationRepo.save(createdOrganization);
  }

  async findAll(queryDto: OrganizationQueryDto) {
    const queryBuilder = this.organizationRepo.createQueryBuilder('organization');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("organization.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.where([
          { name: ILike(`%${queryDto.search ?? ''}%`) },
          { email: ILike(`%${queryDto.search ?? ''}%`) },
          { contact: ILike(`%${queryDto.search ?? ''}%`) },
          { representativeContact: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
      }))
      .leftJoinAndSelect('organization.address', 'address')
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
    const foundOrganization = await this.organizationRepo.findOne({
      where: { id },
      relations: { address: true },
    });
    if (!foundOrganization) throw new BadRequestException('Organization not found');
    return foundOrganization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    const foundOrganization = await this.findOne(id);

    // retrieving donations
    const donations = updateOrganizationDto.donations?.length ? await this.donationRepo.find({
      where: {
        id: In(updateOrganizationDto.donations)
      }
    }) : null;

    // retrieving logo file name
    const logo = updateOrganizationDto.logo ? getFileName(updateOrganizationDto.logo) : foundOrganization.logo;

    // updating address
    updateOrganizationDto.country && await this.addressService.update(foundOrganization.address.id, extractAddress(updateOrganizationDto))

    Object.assign(foundOrganization, {
      ...updateOrganizationDto,
      donations,
      logo
    })

    return await this.organizationRepo.save(foundOrganization);
  }

  async remove(ids: string[]) {
    const foundOrganizations = await this.organizationRepo.find({
      where: {
        id: In(ids)
      }
    });
    await this.organizationRepo.softRemove(foundOrganizations);

    return {
      success: true,
      message: 'Organizations deleted successfully',
    }
  }

  async restore(ids: string[]) {
    const existingOrganizations = await this.organizationRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingOrganizations) throw new BadRequestException('Organization not found');

    return await this.organizationRepo.restore(ids);
  }

  async clearTrash() {
    return await this.organizationRepo.delete({
      deletedAt: Not(IsNull())
    })
  }
}
