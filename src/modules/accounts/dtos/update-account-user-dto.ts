import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, MaxLength, IsEnum, ValidateIf } from 'class-validator';
import { IsCpf } from '@/common/validators/is-cpf.validator';
import { RolesTypes } from '@/modules/roles/dtos/roles-types.dto';
import { MatchPassword } from '@/common/validators/match-password.validator';

export class UpdateAccountUserDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'O e-mail deve ser um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @MinLength(14, { message: 'O telefone deve ter pelo menos 10 dígitos.' })
  @MaxLength(15, { message: 'O telefone deve ter pelo menos 11 dígitos.' })
  cellphone: string;

  @IsString({ message: 'O CPF deve ser uma string.' })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsCpf({ message: 'CPF inválido.' })
  cpf: string;

  @IsOptional()
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  @ValidateIf((obj, value) => value !== undefined && value !== null && value !== '')
  password?: string;

  @IsOptional()
  @IsString({ message: 'A confirmação de senha deve ser uma string.' })
  @ValidateIf((obj, value) => value !== undefined && value !== null && value !== '')
  @MatchPassword('password', {
    message: 'A confirmação de senha não corresponde à senha.',
    each: true,
    context: {
      passwordProvided: true,
      confirmPasswordProvided: true
    }
  })
  confirmPassword?: string;

  @IsEnum(RolesTypes, { message: 'O tipo de usuário informado é inválido.' })
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório.' })
  role: RolesTypes;
}
