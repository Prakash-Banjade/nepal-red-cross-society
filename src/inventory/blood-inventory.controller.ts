import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
// import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { BloodInventoryService } from './blood-inventory.service';
import { CreateBloodInventoryDto } from './dto/create-blood_inventory.dto';
import { BloodInventoryItemQueryDto } from './dto/blood-inventory-item-query.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';

@ApiTags('Blood Inventory')
@Controller('bloodInventory')
export class BloodInventoryController {
    constructor(private readonly bloodInventoryService: BloodInventoryService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
    @FormDataRequest({ storage: FileSystemStoredFile })
    create(@Body() createBloodInventoryDto: CreateBloodInventoryDto) {
        return this.bloodInventoryService.create(createBloodInventoryDto);
    }

    @Get()
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findAll() {
        return this.bloodInventoryService.findAll();
    }

    @Get(':id')
    @ApiPaginatedResponse(CreateBloodInventoryDto)
    @ChekcAbilities({ action: Action.READ, subject: 'all' })
    findOne(@Param('id') id: string, @Query() queryDto: BloodInventoryItemQueryDto) {
        return this.bloodInventoryService.findOne(id, queryDto);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    //   return this.bloodInventoryService.update(id, updateInventoryDto);
    // }

    @Delete(':id')
    @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
    remove(@Param('id') id: string) {
        return this.bloodInventoryService.remove(id);
    }
}
