import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/core/decorators/apiPaginatedResponse.decorator';
import { PageOptionsDto } from 'src/core/dto/pageOptions.dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@ApiTags('Certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ApiOperation({ description: 'Create donor donation certificate', summary: "Create new certificate" })
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificateService.create(createCertificateDto);
  }
  
  @Get()
  @ApiOperation({ description: 'Get all certificates', summary: "Get certificates" })
  @ApiPaginatedResponse(CreateCertificateDto)
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.certificateService.findAll(pageOptionsDto);
  }
  
  @Get(':id')
  @ApiOperation({ description: 'Get certificate by id', summary: "Get certificate by id" })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.certificateService.findOne(id);
  }
  
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'Update certificate by id', summary: "Edit existing certificate" })
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCertificateDto: UpdateCertificateDto) {
    return this.certificateService.update(id, updateCertificateDto);
  }

  @Post('deleteMany')
  @ApiOperation({ description: 'Delete certificate by id', summary: "Delete existing certificate" })
  remove(@Body('ids') ids: string[]) {
    return this.certificateService.remove(ids);
  }
}
