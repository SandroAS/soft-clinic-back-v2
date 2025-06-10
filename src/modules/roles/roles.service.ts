import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/entities/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesTypes } from './dtos/roles-types.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService
  ) {}

  findAll() {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  async findByName(name: RolesTypes): Promise<Role | undefined> {
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :name', { name })
      .leftJoinAndSelect('role.permissions', 'permission')
      .select([
        'role.id',
        'role.name',
        'permission.name',
      ])
      .getOne();

    if (!role) {
      return undefined;
    }

    if (role.permissions && role.permissions.length > 0) {
      role.permissions = role.permissions.map(permission => {
        return permission.name;
      }) as any;
      return role;
    }

    role.permissions = [];
    return role;
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
  }

  async assignPermissions(roleId: number, permissionIds: number[]) {
    const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permissions = await this.permissionsService.findByIds(permissionIds);
    role.permissions = permissions;

    return this.roleRepository.save(role);
  }
}
