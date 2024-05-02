import { Test, TestingModule } from '@nestjs/testing';
import { DonorCardService } from './donor_card.service';

describe('DonorCardService', () => {
  let service: DonorCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonorCardService],
    }).compile();

    service = module.get<DonorCardService>(DonorCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
