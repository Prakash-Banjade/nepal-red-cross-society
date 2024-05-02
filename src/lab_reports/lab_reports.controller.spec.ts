import { Test, TestingModule } from '@nestjs/testing';
import { LabReportsController } from './lab_reports.controller';
import { LabReportsService } from './lab_reports.service';

describe('LabReportsController', () => {
  let controller: LabReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabReportsController],
      providers: [LabReportsService],
    }).compile();

    controller = module.get<LabReportsController>(LabReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
