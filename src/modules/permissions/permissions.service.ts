import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from '@/entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async findAllArrayOfStrings(): Promise<string[]> {
    let permissions = await this.permissionRepository
      .createQueryBuilder('permission')
      .select(['permission.name'])
      .getMany();

    return permissions.map(permission => permission.name);
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return permission;
  }

  async findByIds(ids: number[]): Promise<Permission[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.permissionRepository.findBy({ id: In(ids) });
  }

  async create(data: Partial<Permission>): Promise<Permission> {
    const permission = this.permissionRepository.create(data);
    return this.permissionRepository.save(permission);
  }

  async update(id: number, data: Partial<Permission>): Promise<Permission> {
    const permission = await this.findOne(id);
    Object.assign(permission, data);
    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionRepository.remove(permission);
  }
}
