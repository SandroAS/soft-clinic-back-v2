import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '@/entities/permission.entity';
import { Role } from '@/entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  findAll() {
    return this.roleRepository.find({ relations: ['permissions'] });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id }, relations: ['permissions'] });
  }

  async assignPermissions(roleId: number, permissionIds: number[]) {
    const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permissions'] });
    if (!role) throw new Error('Role not found');

    const permissions = await this.permissionRepository.findByIds(permissionIds);
    role.permissions = permissions;

    return this.roleRepository.save(role);
  }
}
