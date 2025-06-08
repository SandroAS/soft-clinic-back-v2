import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptCharge } from '@/entities/attempt-charge.entity';
import { AttemptChargesService } from './attempt-charges.service';
import { AttemptChargesController } from './attempt-charges.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AttemptCharge])],
  controllers: [AttemptChargesController],
  providers: [AttemptChargesService],
  exports: [AttemptChargesService],
})
export class AttemptChargesModule {}
