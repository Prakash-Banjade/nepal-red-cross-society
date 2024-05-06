import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Donors')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  create(@Body() createDonorDto: CreateDonorDto) {
    return this.donorsService.create(createDonorDto);
  }

  @Get()
  findAll() {
    return this.donorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorsService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDonorDto: UpdateDonorDto) {
    return this.donorsService.update(id, updateDonorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorsService.remove(id);
  }
}
