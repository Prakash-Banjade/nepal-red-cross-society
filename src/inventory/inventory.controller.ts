import { Controller, Get, Post, Body, Param, Query, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action, RequestUser } from 'src/core/types/global.types';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/queryDto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CurrentUser } from 'src/core/decorators/user.decorator';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createInventoryDto: CreateInventoryDto, @CurrentUser() currentUser: RequestUser) {
    return this.inventoryService.create(createInventoryDto, currentUser);
  }

  @Get()
  @ApiPaginatedResponse(CreateInventoryDto)
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll(@Query() queryDto: QueryDto, @CurrentUser() currentUser: RequestUser) {
    return this.inventoryService.findAll(queryDto, currentUser);
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: RequestUser) {
    return this.inventoryService.findOne(id, currentUser);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto, @CurrentUser() currentUser: RequestUser) {
  //   return this.inventoryService.update(id, updateInventoryDto, currentUser);
  // }

  // @Post('deleteMany')
  // @HttpCode(HttpStatus.OK)
  // @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  // remove(@Body('ids') ids: string, @CurrentUser() currentUser: RequestUser) {
  //   return this.inventoryService.remove(JSON.parse(ids), currentUser);
  // }

  // @Post('restoreMany')
  // @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
  // @HttpCode(HttpStatus.OK)
  // restore(@Body('ids') ids: string, @CurrentUser() currentUser: RequestUser) {
  //   return this.inventoryService.restore(JSON.parse(ids), currentUser);
  // }

  // @Post('emptyTrash')
  // @HttpCode(HttpStatus.OK)
  // @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  // emptyTrash(@CurrentUser() currentUser: RequestUser) {
  //   return this.inventoryService.clearTrash(currentUser);
  // }
}
