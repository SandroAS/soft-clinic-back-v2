import { Expose, Type } from 'class-transformer';
import { Gender, User } from '@/entities/user.entity';
import { RoleResponseDto } from '@/modules/roles/dtos/role-response.dto';
import { AccountResponseDto } from '@/modules/accounts/dtos/account-response.dto';
import { UserMetasResponseDto } from '@/modules/user-metas/dtos/user-metas-response.dto';

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
  profile_img_url: string;

  @Expose()
  gender: Gender;

  @Expose({ name: 'is_active' })
  is_active: boolean;

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;

  @Expose()
  @Type(() => AccountResponseDto)
  account: AccountResponseDto;

  @Expose()
  @Type(() => UserMetasResponseDto)
  userMetas: UserMetasResponseDto[];

  constructor(partial: Partial<User>) {
    this.uuid = partial.uuid;
    this.name = partial.name;
    this.email = partial.email;
    this.cellphone = partial.cellphone;
    this.cpf = partial.cpf;
    this.profile_img_url = partial.profile_img_url;
    this.gender = partial.gender;
    this.is_active = partial.is_active;
    this.role = null;
    this.account = null;
    this.userMetas = [];

    if (partial.role) {
      this.role = new RoleResponseDto(partial.role);
    }

    if (partial.account) {
      this.account = new AccountResponseDto(partial.account);
    }

    if (partial.userMetas && partial.userMetas.length > 0) {
      this.userMetas = partial.userMetas.map(
        (userMeta) => new UserMetasResponseDto(userMeta)
      );
    }
  }
}