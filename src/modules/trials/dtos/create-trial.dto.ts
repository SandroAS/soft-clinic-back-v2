import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsDate } from 'class-validator';

export class CreateTrialDto {
  @IsInt()
  account_id: number;

  @Type(() => Date)
  @IsDate()
  started_at: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  ended_at?: Date;
}
