import { Test, TestingModule } from '@nestjs/testing';
import { PaymentIntentionsController } from './payment-intentions.controller';

describe('PaymentIntentionsController', () => {
  let controller: PaymentIntentionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentIntentionsController],
    }).compile();

    controller = module.get<PaymentIntentionsController>(PaymentIntentionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
