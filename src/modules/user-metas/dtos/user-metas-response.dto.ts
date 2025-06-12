import { Expose } from 'class-transformer';
import { UserMeta } from '@/entities/user-meta.entity';

export class UserMetasResponseDto {
  @Expose()
  key: string;

  @Expose()
  value: string;

  @Expose()
  description: string;

  constructor(partial: Partial<UserMeta>) {
    this.key = partial.key;
    this.value = partial.value;
    this.description = partial.description;
  }
}
