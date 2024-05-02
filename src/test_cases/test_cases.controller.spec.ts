import { Test, TestingModule } from '@nestjs/testing';
import { TestCasesController } from './test_cases.controller';
import { TestCasesService } from './test_cases.service';

describe('TestCasesController', () => {
  let controller: TestCasesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestCasesController],
      providers: [TestCasesService],
    }).compile();

    controller = module.get<TestCasesController>(TestCasesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
