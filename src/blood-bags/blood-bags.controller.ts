import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BloodBagsService } from './blood-bags.service';
import { CreateBloodBagDto } from './dto/create-blood-bag.dto';
import { UpdateBloodBagDto } from './dto/update-blood-bag.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Blood Bags')
@Controller('blood-bags')
export class BloodBagsController {
  constructor(private readonly bloodBagsService: BloodBagsService) { }

  @Post()
  create(@Body() createBloodBagDto: CreateBloodBagDto) {
    return this.bloodBagsService.create(createBloodBagDto);
  }

  @Get()
  findAll() {
    return this.bloodBagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bloodBagsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBloodBagDto: UpdateBloodBagDto) {
    return this.bloodBagsService.update(id, updateBloodBagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bloodBagsService.remove(id);
  }
}
