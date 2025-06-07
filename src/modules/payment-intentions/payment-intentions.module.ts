import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentIntention } from '@/entities/payment-intention.entity';
import { PaymentIntentionsService } from './payment-intentions.service';
import { PaymentIntentionsController } from './payment-intentions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentIntention])],
  providers: [PaymentIntentionsService],
  controllers: [PaymentIntentionsController],
  exports: [PaymentIntentionsService],
})
export class PaymentIntentionsModule {}
