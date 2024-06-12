import { Test, TestingModule } from '@nestjs/testing';
import { BagTypesController } from './bag-types.controller';
import { BagTypesService } from './bag-types.service';

describe('BagTypesController', () => {
  let controller: BagTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BagTypesController],
      providers: [BagTypesService],
    }).compile();

    controller = module.get<BagTypesController>(BagTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
