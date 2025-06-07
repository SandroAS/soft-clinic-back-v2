import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionChargesController } from './subscription-charges.controller';

describe('SubscriptionChargesController', () => {
  let controller: SubscriptionChargesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionChargesController],
    }).compile();

    controller = module.get<SubscriptionChargesController>(SubscriptionChargesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
