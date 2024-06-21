import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { BloodRequestService } from './blood_request.service';
import { CreateBloodRequestDto } from './dto/create-blood_request.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action, RequestUser } from 'src/core/types/global.types';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { Throttle } from '@nestjs/throttler';
import { BloodRequestQueryDto } from './dto/blood-request-query.dto';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { TransactionInterceptor } from 'src/core/interceptors/transaction.interceptor';

@Controller('blood-request')
@ApiTags('Blood Request')
export class BloodRequestController {
  constructor(private readonly bloodRequestService: BloodRequestService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  @UseInterceptors(TransactionInterceptor)
  create(@Body() createBloodRequestDto: CreateBloodRequestDto, @CurrentUser() currentUser: RequestUser) {
    return this.bloodRequestService.create(createBloodRequestDto, currentUser);
  }

  @Get()
  @ApiPaginatedResponse(CreateBloodRequestDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll(@Query() queryDto: BloodRequestQueryDto) {
    return this.bloodRequestService.findAll(queryDto);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.bloodRequestService.findOne(id);
  }

  // @Patch(':id')
  // @ApiConsumes('multipart/form-data')
  // @Throttle({ default: { limit: 1, ttl: 2000 } })
  // @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  // @FormDataRequest({ storage: FileSystemStoredFile })
  // update(@Param('id') id: string, @Body() updateBloodRequestDto: UpdateBloodRequestDto) {
  //   return this.bloodRequestService.update(id, updateBloodRequestDto);
  // }

  @Post('deleteMany')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  @UseInterceptors(TransactionInterceptor)
  remove(@Body('ids') ids: string) {
    return this.bloodRequestService.remove(JSON.parse(ids));
  }

  @Post('restoreMany')
  @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
  @UseInterceptors(TransactionInterceptor)
  @HttpCode(HttpStatus.OK)
  restore(@Body('ids') ids: string) {
    return this.bloodRequestService.restore(JSON.parse(ids));
  }

  @Post('emptyTrash')
  @HttpCode(HttpStatus.OK)
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  @UseInterceptors(TransactionInterceptor)
  emptyTrash() {
    return this.bloodRequestService.clearTrash();
  }
}
