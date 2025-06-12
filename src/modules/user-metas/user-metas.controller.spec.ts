import { Test, TestingModule } from '@nestjs/testing';
import { UserMetasController } from './user-metas.controller';

describe('UserMetasController', () => {
  let controller: UserMetasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserMetasController],
    }).compile();

    controller = module.get<UserMetasController>(UserMetasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
