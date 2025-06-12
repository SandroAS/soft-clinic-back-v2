import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMeta } from '@/entities/user-meta.entity';
import { UserMetasService } from './user-metas.service';
import { UserMetasController } from './user-metas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserMeta])],
  providers: [UserMetasService],
  controllers: [UserMetasController],
  exports: [UserMetasService]
})
export class UserMetasModule {}
