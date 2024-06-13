import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceChargeService } from './service-charge.service';
import { CreateServiceChargeDto } from './dto/create-service-charge.dto';
import { UpdateServiceChargeDto } from './dto/update-service-charge.dto';
import { Throttle } from '@nestjs/throttler';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { Action } from 'src/core/types/global.types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Service Charges')
@Controller('service-charges')
export class ServiceChargeController {
  constructor(private readonly serviceChargeService: ServiceChargeService) { }

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createServiceChargeDto: CreateServiceChargeDto) {
    return this.serviceChargeService.create(createServiceChargeDto);
  }

  @Get()
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll() {
    return this.serviceChargeService.findAll();
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id') id: string) {
    return this.serviceChargeService.findOne(id);
  }

  @Patch(':id')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updateServiceChargeDto: UpdateServiceChargeDto) {
    return this.serviceChargeService.update(id, updateServiceChargeDto);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id') id: string) {
    return this.serviceChargeService.remove(id);
  }
}
