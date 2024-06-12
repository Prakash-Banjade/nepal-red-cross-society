import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action, RequestUser } from 'src/core/types/global.types';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { BloodInventoryService } from './blood-inventory.service';
import { CreateBloodInventoryDto } from './dto/create-blood_inventory.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { BloodInventoryQueryDto } from './dto/blood-inventory-query.dto';

@ApiTags('Blood Inventory')
@Controller('bloodInventory')
export class BloodInventoryController {
    constructor(private readonly bloodInventoryService: BloodInventoryService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
    @FormDataRequest({ storage: FileSystemStoredFile })
    create(@Body() createBloodInventoryDto: CreateBloodInventoryDto, @CurrentUser() currentUser: RequestUser) {
        return this.bloodInventoryService.create(createBloodInventoryDto, currentUser);
    }

    @Get()
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findAll(@Query() queryDto: BloodInventoryQueryDto, @CurrentUser() currentUser: RequestUser) {
        return this.bloodInventoryService.findAll(queryDto, currentUser);
    }

    @Get(':id')
    @ApiPaginatedResponse(CreateBloodInventoryDto)
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findOne(@Param('id') id: string, @CurrentUser() currentUser: RequestUser) {
        return this.bloodInventoryService.findOne(id, currentUser);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    //   return this.bloodInventoryService.update(id, updateInventoryDto);
    // }

    // @Delete(':id')
    // @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
    // remove(@Param('id') id: string) {
    //     return this.bloodInventoryService.remove(id);
    // }
}
