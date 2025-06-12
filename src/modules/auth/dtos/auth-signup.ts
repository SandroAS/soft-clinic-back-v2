import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsBoolean,
  IsOptional,
  Equals,
} from 'class-validator';
import { IsCpf } from '@/common/validators/is-cpf.validator';

export class AuthSignupDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'O e-mail deve ser um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsNotEmpty({ message: 'O telefone é obrigatório.' })
  @MinLength(10, { message: 'O telefone deve ter pelo menos 10 dígitos.' })
  cellphone: string;

  @IsString({ message: 'O CPF deve ser uma string.' })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsCpf({ message: 'CPF inválido.' })
  cpf: string;

  @IsString({ message: 'O tipo de clínica deve ser uma string.' })
  @IsNotEmpty({ message: 'O tipo de clínica é obrigatório.' })
  // Se 'clinicType' tiver valores fixos, pode usar @IsIn(['odontologica', 'psicologia'])
  clinicType: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsString({ message: 'A confirmação de senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória quando fornecida.' })
  @Equals('password', { message: 'A confirmação de senha não corresponde à senha.' })
  confirmPassword?: string;

  @IsBoolean({ message: 'A aceitação dos termos deve ser um valor booleano.' })
  @Equals(true, { message: 'Você deve aceitar os termos de serviço e política de privacidade.' })
  termsAccepted: boolean;
}