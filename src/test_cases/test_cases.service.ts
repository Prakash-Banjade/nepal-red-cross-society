import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-test_case.dto';
import { UpdateTestCaseDto } from './dto/update-test_case.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TestCase } from './entities/test_case.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TestCasesService {
  constructor(
    @InjectRepository(TestCase) private testCaseRepo: Repository<TestCase>,
  ) { }

  async create(createTestCaseDto: CreateTestCaseDto) {
    const foundTestCaseWithSameName = await this.testCaseRepo.findOneBy({
      name: createTestCaseDto.name,
    })

    if (foundTestCaseWithSameName) throw new BadRequestException('Test case with this name already exists');

    const testCase = this.testCaseRepo.create(createTestCaseDto);
    return await this.testCaseRepo.save(testCase);
  }

  async findAll() {
    return await this.testCaseRepo.find();
  }

  async findOne(id: string) {
    const existingTestCase = await this.testCaseRepo.findOneBy({ id });
    if (!existingTestCase) throw new BadRequestException('Test case not found');

    return existingTestCase;
  }

  async update(id: string, updateTestCaseDto: UpdateTestCaseDto) {
    const existingTestCase = await this.findOne(id);

    Object.assign(existingTestCase, updateTestCaseDto);

    return await this.testCaseRepo.save(existingTestCase);
  }

  async remove(id: string) {
    const foundTestCase = await this.findOne(id);

    await this.testCaseRepo.remove(foundTestCase);

    return {
      success: true,
      message: 'Test case deleted',
    }
  }
}
