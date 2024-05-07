import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_PAGINATION_CONFIG, User } from './entities/user.entity';
import { Repository } from 'typeorm';
// import { FilterOperator, FilterSuffix, PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) { }

  // async findAll() {
  //   return await this.usersRepository.find({
  //     select: {
  //       id: true,
  //       firstName: true,
  //       lastName: true,
  //       email: true,
  //       role: true,
  //       image: true,
  //       isDonor: true,
  //       createdAt: true,
  //       updatedAt: true,
  //     },
  //   });
  // }

  // public findAll(query: PaginateQuery): Promise<Paginated<User>> {
  //   return paginate(query, this.usersRepository, USER_PAGINATION_CONFIG)
  // }

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.usersRepository, options);
  }

  async findOne(id: string) {
    const existingUser = await this.usersRepository.findOneBy({ id });
    if (!existingUser) throw new NotFoundException('User not found');

    return existingUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.findOne(id);

    // TODO: finalize how to store image

    Object.assign(existingUser, {
      firstName: updateUserDto.lastName,
      lastName: updateUserDto.lastName,
      email: updateUserDto.email,
      // image: updateUserDto.image
    });

    return await this.usersRepository.save(existingUser);
  }

  async remove(id: string) {
    const existingUser = await this.findOne(id);
    await this.usersRepository.softRemove(existingUser);

    return {
      message: 'User removed',
      user: {
        email: existingUser.email,
      },
    };
  }
}
