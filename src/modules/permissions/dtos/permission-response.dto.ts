import { Expose } from 'class-transformer';
import { Permission } from '@/entities/permission.entity';

export class PermissionResponseDto {
  @Expose()
  name: string;

  constructor(partial: Partial<Permission>) {
    Object.assign(this, partial);
  }
}
