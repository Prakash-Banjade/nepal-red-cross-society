import { Controller, Get, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ChekcAbilities } from 'src/decorators/abilities.decorator';
import { Action } from 'src/types/global.types';
import { USER_PAGINATION_CONFIG, User } from './entities/user.entity';
// import { Paginate, PaginateQuery, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { CreateUserDto } from './dto/create-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly abilityFactory: CaslAbilityFactory
  ) { }

  // Users are created from auth/register

  @Get()
  // @PaginatedSwaggerDocs(CreateUserDto, USER_PAGINATION_CONFIG)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.usersService.findAll({
      page,
      limit,
      route: 'http://cats.com/cats',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @FormDataRequest({ storage: MemoryStoredFile })
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
