import { Test, TestingModule } from '@nestjs/testing';
import { TrialsController } from './trials.controller';

describe('TrialsController', () => {
  let controller: TrialsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrialsController],
    }).compile();

    controller = module.get<TrialsController>(TrialsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
