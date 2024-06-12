import { Test, TestingModule } from '@nestjs/testing';
import { BagTypesService } from './bag-types.service';

describe('BagTypesService', () => {
  let service: BagTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BagTypesService],
    }).compile();

    service = module.get<BagTypesService>(BagTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
