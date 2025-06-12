import { Test, TestingModule } from '@nestjs/testing';
import { UserMetasService } from './user-metas.service';

describe('UserMetasService', () => {
  let service: UserMetasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserMetasService],
    }).compile();

    service = module.get<UserMetasService>(UserMetasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
