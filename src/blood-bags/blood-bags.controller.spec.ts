import { Test, TestingModule } from '@nestjs/testing';
import { BloodBagsController } from './blood-bags.controller';
import { BloodBagsService } from './blood-bags.service';

describe('BloodBagsController', () => {
  let controller: BloodBagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BloodBagsController],
      providers: [BloodBagsService],
    }).compile();

    controller = module.get<BloodBagsController>(BloodBagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
