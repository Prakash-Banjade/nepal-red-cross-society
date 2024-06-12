import { Test, TestingModule } from '@nestjs/testing';
import { ServiceChargeController } from './service-charge.controller';
import { ServiceChargeService } from './service-charge.service';

describe('ServiceChargeController', () => {
  let controller: ServiceChargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceChargeController],
      providers: [ServiceChargeService],
    }).compile();

    controller = module.get<ServiceChargeController>(ServiceChargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
