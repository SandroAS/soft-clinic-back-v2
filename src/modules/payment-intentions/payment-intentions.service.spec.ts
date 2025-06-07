import { Test, TestingModule } from '@nestjs/testing';
import { PaymentIntentionsService } from './payment-intentions.service';

describe('PaymentIntentionsService', () => {
  let service: PaymentIntentionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentIntentionsService],
    }).compile();

    service = module.get<PaymentIntentionsService>(PaymentIntentionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
