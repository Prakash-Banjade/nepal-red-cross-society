import { Controller, Get, Post, Body, Param, Query, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action, RequestUser } from 'src/core/types/global.types';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { QueryDto } from 'src/core/dto/queryDto';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { InventoryItemService } from './inventory-item.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@ApiTags('Inventory Item')
@Controller('inventoryItem')
export class InventoryItemController {
    constructor(private readonly inventoryItemService: InventoryItemService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
    @FormDataRequest({ storage: FileSystemStoredFile })
    create(@Body() createInventoryItemDto: CreateInventoryItemDto, @CurrentUser() currentUser: RequestUser) {
        return this.inventoryItemService.create(createInventoryItemDto, currentUser);
    }

    @Get()
    @ApiPaginatedResponse(CreateInventoryDto)
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findAll(@Query() queryDto: QueryDto, @CurrentUser() currentUser: RequestUser) {
        return this.inventoryItemService.findAll(queryDto, currentUser);
    }

    @Get(':id')
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findOne(@Param('id') id: string, @CurrentUser() currentUser: RequestUser) {
        return this.inventoryItemService.findOne(id, currentUser);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateInventoryItemDto: Partial<CreateInventoryItemDto>, @CurrentUser() currentUser: RequestUser) {
        return this.inventoryItemService.update(id, updateInventoryItemDto, currentUser);
    }

    @Post('deleteMany')
    @HttpCode(HttpStatus.OK)
    @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
    remove(@Body('ids') ids: string, @CurrentUser() currentUser: RequestUser) {
        return this.inventoryItemService.remove(JSON.parse(ids), currentUser);
    }

    @Post('restoreMany')
    @ChekcAbilities({ action: Action.RESTORE, subject: 'all' })
    @HttpCode(HttpStatus.OK)
    restore(@Body('ids') ids: string, @CurrentUser() currentUser: RequestUser) {
        return this.inventoryItemService.restore(JSON.parse(ids), currentUser);
    }

    @Post('emptyTrash')
    @HttpCode(HttpStatus.OK)
    @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
    emptyTrash(@CurrentUser() currentUser: RequestUser) {
        return this.inventoryItemService.clearTrash(currentUser);
    }
}
