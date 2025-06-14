import { Gender } from '@/entities/user.entity';
import { IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  cellphone?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  profile_img_url?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  google_id?: string;

  @IsNumber()
  @IsOptional()
  account_id?: number;
}
