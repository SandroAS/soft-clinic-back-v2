import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Min, IsUUID, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty({ message: 'O nome do serviço é obrigatório.' })
  @IsString({ message: 'O nome do serviço deve ser uma string.' })
  name: string;

  @IsString({ message: 'A descrição do serviço deve ser uma string.' })
  description: string;

  @IsNotEmpty({ message: 'O preço do serviço é obrigatório.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'O preço deve ser um número válido.' })
  @Min(0, { message: 'O preço não pode ser negativo.' })
  price: number;

  @IsNotEmpty({ message: 'O ID do módulo de sistema é obrigatório.' })
  @IsUUID('4', { message: 'O UUID do módulo de sistema deve ser um UUID válido (versão 4).' })
  system_module_uuid: string;
}
