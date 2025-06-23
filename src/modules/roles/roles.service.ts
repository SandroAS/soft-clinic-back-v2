import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';
import { Role } from '@/entities/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesTypes } from './dtos/roles-types.dto';
import { PaginationResult } from '@/common/services/base.service';
import { PaginationDto } from '@/common/dtos/pagination.dto';

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
        'role.uuid',
        'role.name',
        'permission.name',
      ])
      .getMany();

    return roles.map(role => {
      return { ...role, permissions: role.permissions.map(permission => permission.name)}
    })
  }

  async findAllWithPaginationOptimized(pagination: PaginationDto): Promise<PaginationResult<any>> {
    const page = parseInt(pagination.page || '1', 10);
    const limit = parseInt(pagination.limit || '10', 10);

    const sortColumn = pagination.sort_column;
    let sortOrder = pagination.sort_order;
    const searchTerm = pagination.search_term;

    const skip = (page - 1) * limit;

    const queryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('role.permissions', 'permission')
      .select([
        'role.uuid AS uuid',
        'role.name AS name',
        'role.created_at AS created_at',
      ]);

    queryBuilder.addSelect('GROUP_CONCAT(permission.name) AS permissionNames');

    queryBuilder.where('role.name <> :superAdminName', { superAdminName: 'SUPER_ADMIN' });

    if (searchTerm) {
      queryBuilder.andWhere(
        `(LOWER(role.name) LIKE LOWER(:searchTerm) OR 
          LOWER(role.uuid) LIKE LOWER(:searchTerm) OR 
          LOWER(permission.name) LIKE LOWER(:searchTerm))`,
        { searchTerm: `%${searchTerm}%` }
      );
    }

    if (sortColumn) {
      let orderByColumn: string;
      switch (sortColumn) {
        case 'name':
          orderByColumn = 'role.name';
          break;
        case 'uuid':
          orderByColumn = 'role.uuid';
          break;
        case 'created_at':
          orderByColumn = 'role.created_at';
          break;
        case 'permissionNames':
          orderByColumn = 'permissionNames';
          break;
        default:
          orderByColumn = 'role.created_at';
          sortOrder = 'asc';
      }
      queryBuilder.orderBy(orderByColumn, sortOrder === 'desc' ? 'DESC' : 'ASC');
    } else {
      queryBuilder.orderBy('role.created_at', 'ASC');
    }
    
    queryBuilder.groupBy('role.uuid'); 

    queryBuilder.offset(skip).limit(limit);

    const countQueryBuilder = this.roleRepository
      .createQueryBuilder('role')
      .where('role.name <> :superAdminName', { superAdminName: 'SUPER_ADMIN' });

    if (searchTerm) {
      countQueryBuilder.leftJoin('role.permissions', 'permission');
      countQueryBuilder.andWhere(
        `(LOWER(role.name) LIKE LOWER(:searchTerm) OR 
          LOWER(role.uuid) LIKE LOWER(:searchTerm) OR 
          LOWER(permission.name) LIKE LOWER(:searchTerm))`,
        { searchTerm: `%${searchTerm}%` }
      );
    }

    const [data, total] = await Promise.all([
      queryBuilder.getRawMany(),
      countQueryBuilder.getCount(),
    ]);

    const mappedData = data.map(row => ({
      id: row.id,
      uuid: row.uuid,
      name: row.name,
      created_at: row.created_at,
      permissions: row.permissionNames ? String(row.permissionNames).split(',') : [],
    }));

    const last_page = Math.ceil(total / limit);

    return {
      data: mappedData,
      total,
      page,
      last_page,
      limit,
    };
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
