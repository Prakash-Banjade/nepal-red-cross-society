import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DonorCardService } from './donor_card.service';
import { CreateDonorCardDto } from './dto/create-donor_card.dto';
import { UpdateDonorCardDto } from './dto/update-donor_card.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Donor Card')
@Controller('donor-card')
export class DonorCardController {
  constructor(private readonly donorCardService: DonorCardService) { }

  @Post()
  create(@Body() createDonorCardDto: CreateDonorCardDto) {
    return this.donorCardService.create(createDonorCardDto);
  }

  @Get()
  findAll() {
    return this.donorCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorCardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDonorCardDto: UpdateDonorCardDto) {
    return this.donorCardService.update(id, updateDonorCardDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorCardService.remove(id);
  }
}
