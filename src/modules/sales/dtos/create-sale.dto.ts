import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsDate,
  IsInt,
  IsDecimal,
} from 'class-validator';
import {
  SaleType,
  PaymentMethod,
  SaleStatus,
  GatewayProvider,
} from '@/entities/sale.entity';

export class CreateSaleDto {
  @IsNumber()
  @IsPositive()
  user_id: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  account_id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  plan_id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  subscription_id?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  subscription_charge_id?: number;

  @IsOptional()
  @IsString()
  transaction_id?: string;

  @IsEnum(['subscription', 'one_time', 'service'])
  type: SaleType;

  @IsNumber()
  @IsPositive()
  original_amount: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  gateway_fee?: number;

  @IsNumber()
  @IsPositive()
  total: number;

  @IsEnum(['CREDIT_CARD', 'BOLETO', 'PIX'])
  method: PaymentMethod;

  @IsOptional()
  @IsInt()
  @IsPositive()
  installments?: number;

  @IsEnum(['PAGARME'])
  gateway: GatewayProvider;

  @IsOptional()
  @IsEnum(['paid', 'waiting_refund', 'refunded', 'chargeback'])
  status?: SaleStatus;

  @IsOptional()
  @IsDate()
  paid_at?: Date;

  @IsOptional()
  @IsString()
  failed_reason?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  refund_solicitation_id?: number;

  @IsOptional()
  @IsDate()
  refund_solicitation_at?: Date;

  @IsOptional()
  @IsDate()
  refunded_at?: Date;
}
