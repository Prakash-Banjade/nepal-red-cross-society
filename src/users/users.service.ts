import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, IsNull, Not, Or, Repository } from 'typeorm';
import getFileName from 'src/core/utils/getImageUrl';
import { CreateUserDto } from './dto/create-user.dto';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { RequestUser } from 'src/core/types/global.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const foundUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (foundUser)
      throw new BadRequestException('User with this email already exists');

    const createdUser = this.usersRepository.create(createUserDto);

    await this.usersRepository.save(createdUser);

    return {
      message: 'User created',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.firstName + ' ' + createdUser.lastName,
      },
    };
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("user.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.role',
        'user.image',
        'user.createdAt',
        'user.updatedAt',
      ])

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const existingUser = await this.usersRepository.findOneBy({ id });
    if (!existingUser) throw new NotFoundException('User not found');

    return existingUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);

    // evaluate image
    const image = getFileName(updateUserDto.image);

    Object.assign(existingUser, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email: updateUserDto.email,
      image,
    });

    return await this.usersRepository.save(existingUser);
  }

  async remove(ids: string[], user: RequestUser) {
    if (ids?.length && ids.includes(user.userId)) throw new BadRequestException('You cannot delete yourself');
    
    const foundUsers = await this.usersRepository.find({
      where: {
        id: In(ids)
      }
    });
    await this.usersRepository.remove(foundUsers);

    return {
      success: true,
      message: 'Deleted successfully',
    }
  }
}
