import { Test, TestingModule } from '@nestjs/testing';
import { AttemptChargesService } from './attempt-charges.service';

describe('AttemptChargesService', () => {
  let service: AttemptChargesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttemptChargesService],
    }).compile();

    service = module.get<AttemptChargesService>(AttemptChargesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
