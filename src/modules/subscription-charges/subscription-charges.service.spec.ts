import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionChargesService } from './subscription-charges.service';

describe('SubscriptionChargesService', () => {
  let service: SubscriptionChargesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionChargesService],
    }).compile();

    service = module.get<SubscriptionChargesService>(SubscriptionChargesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
