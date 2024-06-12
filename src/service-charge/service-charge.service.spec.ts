import { Test, TestingModule } from '@nestjs/testing';
import { ServiceChargeService } from './service-charge.service';

describe('ServiceChargeService', () => {
  let service: ServiceChargeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceChargeService],
    }).compile();

    service = module.get<ServiceChargeService>(ServiceChargeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
