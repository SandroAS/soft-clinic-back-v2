import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, IsDate, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentIntentionDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  accountId?: number;

  @IsEnum(['charging', 'waiting_payment', 'expired', 'cancelled', 'completed'])
  status: 'charging' | 'waiting_payment' | 'expired' | 'cancelled' | 'completed';

  @IsDecimal()
  amount: number;

  @IsEnum(['credit_card', 'pix', 'boleto'])
  method: 'credit_card' | 'pix' | 'boleto';

  @IsOptional()
  @IsString()
  pixCopyPaste?: string;

  @IsOptional()
  @IsString()
  qr_code_img_url?: string;

  @IsOptional()
  @IsString()
  bar_code?: string;

  @IsOptional()
  @IsString()
  bar_code_img_url?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expires_at?: Date;

  @IsOptional()
  @IsNumber()
  total_attempts?: number;

  @IsOptional()
  @IsNumber()
  sale_id?: number;

  @IsOptional()
  @IsNumber()
  parent_intention_id?: number;
}
