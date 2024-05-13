import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/core/dto/pageOptions.dto';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@ApiBearerAuth()
@ApiTags('Volunteers')
@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteersService.create(createVolunteerDto);
  }

  @Get()
  @ApiPaginatedResponse(CreateVolunteerDto)
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.volunteersService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.volunteersService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVolunteerDto: UpdateVolunteerDto,
  ) {
    return this.volunteersService.update(id, updateVolunteerDto);
  }

  @Post('deleteMany')
  remove(@Body('ids') ids: string[]) {
    return this.volunteersService.remove(ids);
  }
}
