import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TestCasesService } from './test_cases.service';
import { CreateTestCaseDto } from './dto/create-test_case.dto';
import { UpdateTestCaseDto } from './dto/update-test_case.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { Action } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';

@ApiTags('Test Cases')
@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @FormDataRequest({ storage: FileSystemStoredFile })
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createTestCaseDto: CreateTestCaseDto) {
    return this.testCasesService.create(createTestCaseDto);
  }

  @Get()
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findAll() {
    return this.testCasesService.findAll();
  }

  @Get(':id')
  @ChekcAbilities({ action: Action.READ, subject: 'all' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.testCasesService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTestCaseDto: UpdateTestCaseDto) {
    return this.testCasesService.update(id, updateTestCaseDto);
  }

  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.testCasesService.remove(id);
  }
}
