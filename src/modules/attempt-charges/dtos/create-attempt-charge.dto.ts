import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { GatewayProvider } from '@/entities/attempt-charge.entity';

export class CreateAttemptChargeDto {
  @IsNumber()
  @IsPositive()
  payment_intention_id: number;

  @IsEnum(['pending', 'failed', 'success'])
  status: 'pending' | 'failed' | 'success';

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(['credit_card', 'pix', 'boleto'])
  method: 'credit_card' | 'pix' | 'boleto';

  @IsEnum(['PAGARME'])
  gateway: GatewayProvider;

  @IsNumber()
  @IsPositive()
  attempt_number: number;

  @IsOptional()
  attempt_at?: Date;
}
