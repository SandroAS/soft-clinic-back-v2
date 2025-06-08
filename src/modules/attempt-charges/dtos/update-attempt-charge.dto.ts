import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { GatewayProvider } from '@/entities/attempt-charge.entity';

export class UpdateAttemptChargeDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  payment_intention_id?: number;

  @IsOptional()
  @IsEnum(['pending', 'failed', 'success'])
  status?: 'pending' | 'failed' | 'success';

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsEnum(['credit_card', 'pix', 'boleto'])
  method?: 'credit_card' | 'pix' | 'boleto';

  @IsOptional()
  @IsEnum(['PAGARME'])
  gateway?: GatewayProvider;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  attempt_number?: number;

  @IsOptional()
  attempt_at?: Date;
}
