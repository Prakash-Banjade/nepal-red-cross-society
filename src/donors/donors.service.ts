import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Donor } from './entities/donor.entity';
import { In, IsNull, Not, Or, Repository } from 'typeorm';
import { AddressService } from 'src/address/address.service';
import getFileName from 'src/core/utils/getImageUrl';
import paginatedData from 'src/core/utils/paginatedData';
import { extractAddress } from 'src/core/utils/extractAddress';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import generator from 'generate-password-ts';

@Injectable()
export class DonorsService {
  constructor(
    @InjectRepository(Donor) private donorRepo: Repository<Donor>,
    private readonly addressService: AddressService,
    private readonly userService: UsersService
  ) { }

  async create(createDonorDto: CreateDonorDto) {
    const existingDonor = await this.donorRepo.findOneBy({ email: createDonorDto.email });
    if (existingDonor) throw new BadRequestException('Donor with this email already exists');

    // evaluating address
    const address = await this.addressService.create(extractAddress(createDonorDto));

    // getting image pathname
    const image = createDonorDto.image ? getFileName(createDonorDto.image) : null;

    // creating donor's user account
    const password = this.generateRandomPassword();
    const user = await this.userService.create({
      firstName: createDonorDto.firstName,
      lastName: createDonorDto.lastName,
      email: createDonorDto.email,
      password,
    } as CreateUserDto);

    const savedUser = await this.userService.findOne(user.user.id); // this approach can be improved as we can directly send the created user after creating

    const donor = this.donorRepo.create({
      ...createDonorDto,
      address,
      image,
      account: savedUser
    });

    // TODO: send email with password
    console.log(password);

    return await this.donorRepo.save(donor);
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.donorRepo.createQueryBuilder('donor');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("donor.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .leftJoinAndSelect('donor.address', 'address')
      .getMany()

    return paginatedData(queryDto, queryBuilder);
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
}
