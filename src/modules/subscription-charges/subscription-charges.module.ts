import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionCharge } from '@/entities/subscription-charge.entity';
import { SubscriptionChargesService } from './subscription-charges.service';
import { SubscriptionChargesController } from './subscription-charges.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionCharge])],
  providers: [SubscriptionChargesService],
  controllers: [SubscriptionChargesController],
  exports: [SubscriptionChargesService],
})
export class SubscriptionChargesModule {}
