import { IsString, IsEmail, IsOptional, Length, ValidateNested } from 'class-validator';
import { IsCnpj } from '@/common/validators/is-cnpj.validator';
import { CreateAddressDto } from '@/modules/addresses/dtos/create-address.dto';
import { Type } from 'class-transformer';

export class CreateCompanyDto {
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  @Length(3, 255, { message: 'O nome deve ter entre 3 e 255 caracteres.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'A razão social deve ser uma string.' })
  @Length(3, 255, { message: 'A razão social deve ter entre 3 e 255 caracteres.' })
  social_reason?: string;

  @IsOptional()
  @IsString({ message: 'O CNPJ deve ser uma string.' })
  @IsCnpj({ message: 'CNPJ inválido.' })
  cnpj?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @Length(8, 20, { message: 'O telefone deve ter entre 8 e 20 caracteres.' })
  cellphone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido.' })
  @Length(5, 255, { message: 'O email deve ter entre 5 e 255 caracteres.' })
  email?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;
}
