import { Test, TestingModule } from '@nestjs/testing';
import { DonorCardController } from './donor_card.controller';
import { DonorCardService } from './donor_card.service';

describe('DonorCardController', () => {
  let controller: DonorCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonorCardController],
      providers: [DonorCardService],
    }).compile();

    controller = module.get<DonorCardController>(DonorCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
