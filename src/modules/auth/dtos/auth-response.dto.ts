// src/common/dtos/auth-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { User } from '@/entities/user.entity'; // A entidade bruta, usada para construir o DTO
import { RoleResponseDto } from '@/modules/roles/dtos/role-response.dto';
import { AccountResponseDto } from '@/modules/accounts/dtos/account-response.dto';

export class AuthResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  cellphone: string;

  @Expose()
  cpf: string;

  @Expose()
  gender: string;

  @Expose({ name: 'is_active' })
  is_active: boolean;

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;

  @Expose()
  @Type(() => AccountResponseDto)
  account: AccountResponseDto;

  constructor(partial: Partial<User>) {
    this.uuid = partial.uuid;
    this.name = partial.name;
    this.email = partial.email;
    this.cellphone = partial.cellphone;
    this.cpf = partial.cpf;
    this.gender = partial.gender;
    this.is_active = partial.is_active;
    this.role = null;
    this.account = null;

    if (partial.role) {
      this.role = new RoleResponseDto(partial.role);
    }

    if (partial.account) {
      this.account = new AccountResponseDto(partial.account);
    }
  }
}