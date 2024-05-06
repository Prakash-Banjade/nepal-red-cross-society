import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TestCasesService } from './test_cases.service';
import { CreateTestCaseDto } from './dto/create-test_case.dto';
import { UpdateTestCaseDto } from './dto/update-test_case.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Test Cases')
@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly testCasesService: TestCasesService) {}

  @Post()
  create(@Body() createTestCaseDto: CreateTestCaseDto) {
    return this.testCasesService.create(createTestCaseDto);
  }

  @Get()
  findAll() {
    return this.testCasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.testCasesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTestCaseDto: UpdateTestCaseDto) {
    return this.testCasesService.update(id, updateTestCaseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.testCasesService.remove(id);
  }
}
