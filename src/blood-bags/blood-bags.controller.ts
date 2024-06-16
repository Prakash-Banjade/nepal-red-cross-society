import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BloodBagsService } from './blood-bags.service';
import { CreateBloodBagDto } from './dto/create-blood-bag.dto';
import { UpdateBloodBagDto } from './dto/update-blood-bag.dto';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { RequestUser } from 'src/core/types/global.types';

@ApiTags('Blood Bags')
@Controller('blood-bags')
export class BloodBagsController {
  constructor(private readonly bloodBagsService: BloodBagsService) { }

  @Post()
  create(@Body() createBloodBagDto: CreateBloodBagDto, @CurrentUser() currentUser: RequestUser) {
    return this.bloodBagsService.create(createBloodBagDto, currentUser);
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
