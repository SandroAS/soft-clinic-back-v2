import { Gender } from '@/entities/user.entity';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserPersonalInformationDto {
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
}
