import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Brackets, ILike, In, IsNull, Not, Or, Repository } from 'typeorm';
import getFileName from 'src/core/utils/getImageUrl';
import { CreateUserDto } from './dto/create-user.dto';
import { Deleted, QueryDto } from 'src/core/dto/queryDto';
import paginatedData from 'src/core/utils/paginatedData';
import { RequestUser } from 'src/core/types/global.types';
import { UserQueryDto } from './entities/user-query.dto';
import { BranchService } from 'src/branch/branch.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly branchService: BranchService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const foundUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (foundUser)
      throw new BadRequestException('User with this email already exists');

    // evaluating image
    const image = createUserDto.image ? getFileName(createUserDto.image) : null;

    // evaluate branch
    const branch = await this.branchService.findOne(createUserDto.branch);

    const createdUser = this.usersRepository.create({
      ...createUserDto,
      image,
      branch
    });

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

  async findAll(queryDto: UserQueryDto) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    const deletedAt = queryDto.deleted === Deleted.ONLY ? Not(IsNull()) : queryDto.deleted === Deleted.NONE ? IsNull() : Or(IsNull(), Not(IsNull()));

    queryBuilder
      .orderBy("user.createdAt", queryDto.order)
      .skip(queryDto.search ? undefined : queryDto.skip)
      .take(queryDto.search ? undefined : queryDto.take)
      .withDeleted()
      .where({ deletedAt })
      .andWhere(new Brackets(qb => {
        qb.where([
          { firstName: ILike(`%${queryDto.search ?? ''}%`) },
          { lastName: ILike(`%${queryDto.search ?? ''}%`) },
          { email: ILike(`%${queryDto.search ?? ''}%`) },
        ]);
      }))
      .andWhere(new Brackets(qb => {
        if (queryDto.role) qb.andWhere({ role: queryDto.role ?? '' });
      }))
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
    const existingUser = await this.usersRepository.findOne({
      where: { id },
      relations: {
        branch: true
      }
    });
    if (!existingUser) throw new NotFoundException('User not found');

    return existingUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);

    // evaluate image
    const image = updateUserDto.image ? getFileName(updateUserDto.image) : existingUser.image;

    // evaluate branch
    const branch = updateUserDto.branch ? await this.branchService.findOne(updateUserDto.branch) : existingUser.branch

    Object.assign(existingUser, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email: updateUserDto.email,
      image,
      branch
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
