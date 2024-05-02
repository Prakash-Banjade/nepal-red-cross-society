import { Test, TestingModule } from '@nestjs/testing';
import { DonationEventsController } from './donation_events.controller';
import { DonationEventsService } from './donation_events.service';

describe('DonationEventsController', () => {
  let controller: DonationEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonationEventsController],
      providers: [DonationEventsService],
    }).compile();

    controller = module.get<DonationEventsController>(DonationEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
