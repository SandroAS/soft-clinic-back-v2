import { Type } from 'class-transformer';
import { IsString, IsOptional, Min, IsUUID, IsNumber } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'O preço deve ser um número válido.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  price?: number;

  @IsOptional()
  @IsUUID('4', { message: 'O UUID do módulo de sistema deve ser um UUID válido (versão 4).' })
  system_module_uuid?: string;
}
