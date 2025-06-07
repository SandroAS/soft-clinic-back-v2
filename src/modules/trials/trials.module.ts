import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trial } from '@/entities/trial.entity';
import { TrialsService } from './trials.service';
import { TrialsController } from './trials.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trial])],
  providers: [TrialsService],
  controllers: [TrialsController],
  exports: [TrialsService],
})
export class TrialsModule {}
