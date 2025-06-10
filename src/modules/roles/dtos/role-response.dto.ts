import { Expose } from 'class-transformer';
import { Role } from '@/entities/role.entity';
import { PermissionResponseDto } from '@/modules/permissions/dtos/permission-response.dto';

export class RoleResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  permissions: string[] | PermissionResponseDto[];

  constructor(partial: Partial<Role>) {
    this.uuid = partial.uuid;
    this.name = partial.name;

    if (partial.permissions) {
      this.permissions = partial.permissions;
    } else {
      this.permissions = [];
    }
  }
}
