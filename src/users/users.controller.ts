import { Controller, Get, Body, Patch, Param, Post, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action, RequestUser } from 'src/core/types/global.types';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateOrganizationDto } from 'src/organizations/dto/create-organization.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/queryDto';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { Throttle } from '@nestjs/throttler';
import { UserQueryDto } from './entities/user-query.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    // private readonly abilityFactory: CaslAbilityFactory
  ) { }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ChekcAbilities({ action: Action.CREATE, subject: User })
  @FormDataRequest({ storage: MemoryStoredFile })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @ApiPaginatedResponse(CreateOrganizationDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll(@Query() queryDto: UserQueryDto) {
    return this.usersService.findAll(queryDto)
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @FormDataRequest({ storage: MemoryStoredFile })
  @Throttle({ default: { limit: 1, ttl: 2000 } })
  @ApiConsumes('multipart/form-data')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // @Post('deleteMany')
  // @HttpCode(HttpStatus.OK)
  // @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  // remove(@Body('ids') ids: string, @CurrentUser() user: RequestUser) {
  //   return this.usersService.remove(JSON.parse(ids), user);
  // }
}
