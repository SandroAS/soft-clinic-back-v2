import { Gender } from '@/entities/user.entity';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

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
  created_at: Date;

  @Expose()
  updated_at: Date;
}
