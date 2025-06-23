import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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

  async findAll() {
    let roles = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name <> :name', { name: 'SUPER_ADMIN' })
      .leftJoinAndSelect('role.permissions', 'permission')
      .select([
        'role.id',
        'role.uuid',
        'role.name',
        'permission.name',
      ])
      .getMany();

    return roles.map(role => {
      return { ...role, permissions: role.permissions.map(permission => permission.name)}
    })
  }

  async findByName(name: RolesTypes, manager?: EntityManager): Promise<Role | undefined> {
    const roleRepository = manager ? manager.getRepository(Role) : this.roleRepository;
    const role = await roleRepository
      .createQueryBuilder('role')
      .where('role.name = :name', { name })
      .leftJoinAndSelect('role.permissions', 'permission')
      .select([
        'role.id',
        'role.uuid',
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
      throw new NotFoundException('Tipo de usuário não encontrado.');
    }

    const permissions = await this.permissionsService.findByIds(permissionIds);
    role.permissions = permissions;

    return this.roleRepository.save(role);
  }
}
