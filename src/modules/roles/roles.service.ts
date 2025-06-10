import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@/entities/role.entity';
import { PermissionsService } from '../permissions/permissions.service';

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
