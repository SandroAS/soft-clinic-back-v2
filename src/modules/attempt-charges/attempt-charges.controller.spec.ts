import { Test, TestingModule } from '@nestjs/testing';
import { AttemptChargesController } from './attempt-charges.controller';

describe('AttemptChargesController', () => {
  let controller: AttemptChargesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttemptChargesController],
    }).compile();

    controller = module.get<AttemptChargesController>(AttemptChargesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
