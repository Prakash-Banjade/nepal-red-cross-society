import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BagTypesService } from './bag-types.service';
import { CreateBagTypeDto } from './dto/create-bag-type.dto';
import { UpdateBagTypeDto } from './dto/update-bag-type.dto';
import { Throttle } from '@nestjs/throttler';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';

@Controller('bag-types')
export class BagTypesController {
  constructor(private readonly bagTypesService: BagTypesService) { }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createBagTypeDto: CreateBagTypeDto) {
    return this.bagTypesService.create(createBagTypeDto);
  }

  @Get()
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll() {
    return this.bagTypesService.findAll();
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.bagTypesService.findOne(id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updateBagTypeDto: UpdateBagTypeDto) {
    return this.bagTypesService.update(id, updateBagTypeDto);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id') id: string) {
    return this.bagTypesService.remove(id);
  }
}
