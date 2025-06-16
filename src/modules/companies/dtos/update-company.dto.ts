import { IsString, IsEmail, IsOptional, Length, Matches } from 'class-validator';

export class UpdateCompanyDto {
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
  @Length(14, 14, { message: 'O CNPJ deve ter exatamente 14 dígitos.' })
  @Matches(/^\d{14}$/, { message: 'O CNPJ deve conter apenas números.' })
  cnpj?: string;

  @IsOptional()
  @IsString({ message: 'O telefone deve ser uma string.' })
  @Length(8, 20, { message: 'O telefone deve ter entre 8 e 20 caracteres.' })
  cellphone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido.' })
  @Length(5, 255, { message: 'O email deve ter entre 5 e 255 caracteres.' })
  email?: string;
}
