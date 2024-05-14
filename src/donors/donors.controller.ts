import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DonorsService } from './donors.service';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { PageOptionsDto } from 'src/core/dto/pageOptions.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';

@ApiTags('Donors')
@Controller('donors')
export class DonorsController {
  constructor(private readonly donorsService: DonorsService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createDonorDto: CreateDonorDto) {
    return this.donorsService.create(createDonorDto);
  }

  @Get()
  @ApiPaginatedResponse(CreateDonorDto)
  findAll(@Query() pageOptionsDto: PageOptionsDto, @Query('deleted') deleted: boolean = false) {
    return this.donorsService.findAll(pageOptionsDto, deleted);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorsService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDonorDto: UpdateDonorDto) {
    return this.donorsService.update(id, updateDonorDto);
  }

  @Post('deleteMany')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Body('ids') ids: string) {
    return this.donorsService.remove(JSON.parse(ids));
  }

  @Post('restore/:id')
  @HttpCode(HttpStatus.OK)
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.donorsService.restore(id);
  }
}
