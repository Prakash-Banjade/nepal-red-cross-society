import { Test, TestingModule } from '@nestjs/testing';
import { BloodBagsService } from './blood-bags.service';

describe('BloodBagsService', () => {
  let service: BloodBagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BloodBagsService],
    }).compile();

    service = module.get<BloodBagsService>(BloodBagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
