import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  admin_id: number;

  @IsOptional()
  @IsInt()
  plan_id?: number;

  @IsOptional()
  @IsInt()
  current_subscription_id?: number;

  @IsOptional()
  @IsInt()
  last_trial_id?: number;

  @IsOptional()
  @IsBoolean()
  in_trial?: boolean;
}
