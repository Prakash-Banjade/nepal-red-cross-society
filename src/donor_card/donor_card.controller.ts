import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DonorCardService } from './donor_card.service';
import { CreateDonorCardDto } from './dto/create-donor_card.dto';
import { UpdateDonorCardDto } from './dto/update-donor_card.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@ApiTags('Donor Card')
@Controller('donor-card')
export class DonorCardController {
  constructor(private readonly donorCardService: DonorCardService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ApiOperation({ description: 'Create a new donor card', summary: 'Create Donor Card' })
  create(@Body() createDonorCardDto: CreateDonorCardDto) {
    return this.donorCardService.create(createDonorCardDto);
  }
  
  @Get()
  @ApiOperation({ description: 'Get all donor cards', summary: 'Get All Donor Cards' })
  findAll() {
    return this.donorCardService.findAll();
  }
  
  @Get(':id')
  @ApiOperation({ description: 'Get a single donor card', summary: 'Get Donor Card' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorCardService.findOne(id);
  }
  
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ApiOperation({ description: 'Update a donor card', summary: 'Update Donor Card' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDonorCardDto: UpdateDonorCardDto) {
    return this.donorCardService.update(id, updateDonorCardDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a donor card', summary: 'Delete Donor Card' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorCardService.remove(id);
  }
}
