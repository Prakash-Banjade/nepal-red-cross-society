import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Donor } from './entities/donor.entity';
import { Brackets, Equal, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import { AddressService } from 'src/address/address.service';
import getFileName from 'src/core/utils/getImageUrl';
import paginatedData from 'src/core/utils/paginatedData';
import { extractAddress } from 'src/core/utils/extractAddress';
import { Deleted } from 'src/core/dto/queryDto';
import { UsersService } from 'src/users/users.service';
import generator from 'generate-password-ts';
import { MailService } from 'src/mail/mail.service';
import { DonorQueryDto } from './dto/donor-query-dto';
import { DonorRepository } from './repository/donor.repository';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(Donor) private donorRepo: Repository<Donor>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly addressService: AddressService,
    private readonly mailService: MailService,
    private readonly donorRepository: DonorRepository,
  ) { }

  async create(createDonorDto: CreateDonorDto) {
    const existingDonor = await this.donorRepo.findOne({
      where: [
        { email: Equal(createDonorDto.email) },
        { phone: Equal(createDonorDto.phone) },
      ]
    });
    if (existingDonor) throw new BadRequestException('Donor with this email or phone already exists');

    // evaluating address
    const address = await this.addressService.create(extractAddress(createDonorDto));

    // getting image pathname
    const image = createDonorDto.image ? getFileName(createDonorDto.image) : null;

    // creating donor's user account
    const password = this.generateRandomPassword();

    const savedUser = createDonorDto?.email ? await this.createUserAccount(createDonorDto, password) : null;

    const donor = this.donorRepo.create({
      ...createDonorDto,
      address,
      image,
      donorId: await this.generateDonorId(),
      account: savedUser
    });

    const createdDonor = await this.donorRepository.saveDonor(donor);

    savedUser && await this.mailService.sendUserCredentials(savedUser, password); // sending credentials via email

    return {
      success: true,
      message: 'Donor created',
      donor: {
        name: createdDonor.firstName + ' ' + createdDonor.lastName,
        email: createdDonor.email,
      }
    }
  }

  async createUserAccount(createDonorDto: CreateDonorDto, password: string) {
    const image = createDonorDto.image ? getFileName(createDonorDto.image) : null

    const user = this.userRepo.create({
      firstName: createDonorDto.firstName,
      lastName: createDonorDto.lastName,
      email: createDonorDto.email,
      image,
      password,
    });

    return await this.donorRepository.saveUser(user);
  }

  async findAll(queryDto: DonorQueryDto) {
    const queryBuilder = this.donorRepo.createQueryBuilder('donor');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("donor.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.where([
          { firstName: ILike(`%${queryDto.search ?? ''}%`) },
          { lastName: ILike(`%${queryDto.search ?? ''}%`) },
          { email: ILike(`%${queryDto.search ?? ''}%`) },
          { phone: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
        queryDto.gender && qb.andWhere({ gender: queryDto.gender });
        queryDto.race && qb.andWhere({ race: queryDto.race })
        queryDto.religion && qb.andWhere({ religion: queryDto.religion });
        queryDto.caste && qb.andWhere({ caste: queryDto.caste });
        queryDto.bloodType && qb.andWhere({ bloodType: queryDto.bloodType });
        queryDto.rhFactor && qb.andWhere({ rhFactor: queryDto.rhFactor });

      }))
      .leftJoinAndSelect('donor.address', 'address')
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
    const existingDonor = await this.donorRepo.findOne({
      where: { id },
      relations: { address: true, donations: true },
      order: { donations: { createdAt: 'DESC' } },
    });
    if (!existingDonor) throw new BadRequestException('Donor not found');
    return existingDonor;
  }

  async update(id: string, updateDonorDto: UpdateDonorDto) {
    const existingDonor = await this.findOne(id);

    // setting if address is updated
    updateDonorDto.country && await this.addressService.update(existingDonor.address.id, extractAddress(updateDonorDto))

    // setting if image is updated
    updateDonorDto.image && (existingDonor.image = getFileName(updateDonorDto.image)); // this might be a better solution

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

  async remove(ids: string[]) {
    const existingDonors = await this.donorRepo.find({
      where: {
        id: In(ids)
      },
      relations: {
        donations: true,
      }
    });
    await this.donorRepo.softRemove(existingDonors);

    return {
      success: true,
      message: 'Donors removed',
    }
  }

  async restore(ids: string[]) {
    const existingDonors = await this.donorRepo.find({
      where: { id: In(ids) },
      withDeleted: true,
    })
    if (!existingDonors) throw new BadRequestException('Donor not found');

    return await this.donorRepo.restore(ids);
  }

  async clearTrash() {
    return await this.donorRepo.delete({
      deletedAt: Not(IsNull())
    })
  }

  private generateRandomPassword() {
    const password = generator.generate({
      length: 8,
      numbers: true
    });
    return password;
  }

  async findDonorWithDonations(id: string) {
    const donor = await this.donorRepo.findOne({
      where: { id },
      relations: { address: true, donations: true },
      order: { donations: { createdAt: 'DESC' } },
    });
    if (!donor) throw new BadRequestException('Donor not found');
    return donor;
  }

  async getMyDetails(email: string) {
    const donor = await this.donorRepo.findOne({
      where: { email },
      relations: {
        donations: true,
        address: true,
      }
    });
    return donor;
  }

  async generateDonorId() {
    const lastDonor = await this.donorRepo.findOne({ where: { donorId: Not(IsNull()) }, order: { donorId: 'DESC' } });
    const donorId = lastDonor ? lastDonor.donorId + 1 : 1
    return donorId
  }
}
