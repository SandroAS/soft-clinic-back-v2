import { IsString, IsNotEmpty, IsOptional, Length, Matches, IsEnum } from 'class-validator';
import { BrazilianStates } from '@/entities/address.entity';

export class CreateAddressDto {

  @IsString({ message: 'O CEP deve ser uma string.' })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @Matches(/^\d{8}$|^\d{5}-\d{3}$/, { message: 'O CEP deve ter 8 dígitos (ex: 12345678) ou 9 dígitos com hífen (ex: 12345-678).' })
  cep: string;

  @IsString({ message: 'A rua deve ser uma string.' })
  @IsNotEmpty({ message: 'A rua é obrigatória.' })
  @Length(3, 255, { message: 'A rua deve ter entre 3 e 255 caracteres.' })
  street: string;

  @IsString({ message: 'O número deve ser uma string.' })
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @Length(1, 20, { message: 'O número deve ter entre 1 e 20 caracteres.' })
  number: string;

  @IsOptional()
  @IsString({ message: 'O complemento deve ser uma string.' })
  @Length(0, 255, { message: 'O complemento deve ter no máximo 255 caracteres.' })
  complement?: string;

  @IsString({ message: 'O bairro deve ser uma string.' })
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @Length(3, 255, { message: 'O bairro deve ter entre 3 e 255 caracteres.' })
  neighborhood: string;

  @IsString({ message: 'A cidade deve ser uma string.' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @Length(3, 255, { message: 'A cidade deve ter entre 3 e 255 caracteres.' })
  city: string;

  @IsEnum(BrazilianStates, { message: 'Estado inválido. Escolha uma sigla válida (ex: SP, MG).' })
  state: BrazilianStates;
}
