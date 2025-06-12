import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreateUserMetaDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  description?: string;
}
