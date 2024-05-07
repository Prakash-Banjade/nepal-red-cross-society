import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Certificate')
@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ description: 'Create donor donation certificate', summary: "Create new certificate" })
  create(@Body() createCertificateDto: CreateCertificateDto) {
    return this.certificateService.create(createCertificateDto);
  }

  @Get()
  @ApiOperation({ description: 'Get all certificates', summary: "Get certificates" })
  findAll() {
    return this.certificateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get certificate by id', summary: "Get certificate by id" })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.certificateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Update certificate by id', summary: "Edit existing certificate" })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCertificateDto: UpdateCertificateDto) {
    return this.certificateService.update(id, updateCertificateDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete certificate by id', summary: "Delete existing certificate" })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.certificateService.remove(id);
  }
}
