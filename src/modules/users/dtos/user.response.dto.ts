import { Gender, User } from '@/entities/user.entity';
import { Expose } from 'class-transformer';

export class UserResponseDto {
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
  gender: Gender;

  @Expose()
  profile_img_url: string;

  constructor(partial: User) {
    this.uuid = partial.uuid;
    this.name = partial.name;
    this.email = partial.email;
    this.cellphone = partial.cellphone;
    this.cpf = partial.cpf;
    this.gender = partial.gender;
    this.profile_img_url = partial.profile_img_url;
  }
}
