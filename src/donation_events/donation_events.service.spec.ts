import { Test, TestingModule } from '@nestjs/testing';
import { DonationEventsService } from './donation_events.service';

describe('DonationEventsService', () => {
  let service: DonationEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DonationEventsService],
    }).compile();

    service = module.get<DonationEventsService>(DonationEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
