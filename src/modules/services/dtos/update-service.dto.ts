import { IsString, IsOptional, IsDecimal, Min, IsUUID } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' }, { message: 'O preço deve ser um número decimal com até 2 casas.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  price?: string;

  @IsOptional()
  @IsUUID('4', { message: 'O UUID do módulo de sistema deve ser um UUID válido (versão 4).' })
  system_module_uuid?: string;
}
