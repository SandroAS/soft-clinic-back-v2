import { IsString, IsOptional } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsOptional()
  current_password?: string;

  @IsString()
  @IsOptional()
  new_password: string;

  @IsString()
  @IsOptional()
  confirmed_new_pass: string;
}
