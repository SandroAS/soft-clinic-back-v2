import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/common/services/base.service';
import { Service } from '@/entities/service.entity';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { SystemModulesService } from '../system-modules/system-modules.service';

@Injectable()
export class ServicesService extends BaseService<Service> {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly systemModulesService: SystemModulesService
  ) {
    super(serviceRepository);
  }

  async createServiceForAccount(createServiceDto: CreateServiceDto, accountId: number): Promise<Service> {
    const systemModule = await this.systemModulesService.findOneByUuid(createServiceDto.system_module_uuid);
    if (!systemModule) {
      throw new NotFoundException(`Módulo do Sistema de UUID: ${createServiceDto.system_module_uuid} não encontrado.`);
    }

    const existingService = await this.serviceRepository.findOne({
      where: { name: createServiceDto.name, account_id: accountId, system_module_id: systemModule.id },
    });
    if (existingService) {
      throw new BadRequestException('Já existe um serviço com este nome para este módulo e conta.');
    }

    const newService = this.serviceRepository.create({
      ...createServiceDto,
      price: Number(createServiceDto.price),
      account_id: accountId,
      system_module_id: systemModule.id
    });

    return this.serviceRepository.save(newService);
  }

  async findAllPaginatedByAccount(pagination: PaginationDto, accountId: number) {
    const searchColumns = ['name', 'description'];
    
    const accountFilter = (qb: any) => {
      qb.andWhere('entity.account_id = :accountId', { accountId });
    };

    return this.findAndPaginate(pagination, searchColumns, accountFilter);
  }

  async findOneByUuidForAccount(uuid: string, accountId: number, relations?: string[]): Promise<Service> {
   return await this.serviceRepository.findOne({ where: { uuid, account_id: accountId }, relations });
  }

  async updateForAccount(uuid: string, updateServiceDto: UpdateServiceDto, accountId: number): Promise<Service> {
    const service = await this.findOneByUuidForAccount(uuid, accountId, ['systemModule']);
    if (!service) {
      throw new BadRequestException(`Serviço com UUID ${uuid} não encontrado para esta conta ao tentar atualizar.`);
    }

    let newSystemModuleId: number | undefined;
    if (updateServiceDto.system_module_uuid && updateServiceDto.system_module_uuid !== service.systemModule.uuid) {
      const systemModule = await this.systemModulesService.findOneByUuid(updateServiceDto.system_module_uuid);
      if (!systemModule) {
        throw new NotFoundException(`Novo Módulo do Sistema de UUID: ${updateServiceDto.system_module_uuid} não encontrado.`);
      }
      newSystemModuleId = systemModule.id;
    } else {
      newSystemModuleId = service.system_module_id; 
    }

    const nameChanged = updateServiceDto.name !== undefined && updateServiceDto.name !== service.name;
    const moduleChanged = newSystemModuleId !== service.system_module_id;

    if (nameChanged || moduleChanged) {
      const targetName = updateServiceDto.name !== undefined ? updateServiceDto.name : service.name;
      const targetSystemModuleId = newSystemModuleId !== undefined ? newSystemModuleId : service.system_module_id;

      const existingServiceWithSameNameAndModule = await this.serviceRepository.findOne({
        where: { 
          name: targetName,
          account_id: accountId,
          system_module_id: targetSystemModuleId
        },
      });

      if (existingServiceWithSameNameAndModule && existingServiceWithSameNameAndModule.uuid !== uuid) {
        throw new BadRequestException('Já existe outro serviço com este nome e módulo para esta conta.');
      }
    }

    Object.assign(service, updateServiceDto);
    if (newSystemModuleId !== undefined && newSystemModuleId !== service.system_module_id) {
      service.system_module_id = newSystemModuleId;
    }

    if (updateServiceDto.price !== undefined) {
      service.price = Number(updateServiceDto.price); 
    }

    return this.serviceRepository.save(service);
  }

  async removeForAccount(uuid: string, accountId: number): Promise<void> {
    const service = await this.serviceRepository.findOne({ where: { uuid, account_id: accountId } });
    if (!service) {
      throw new NotFoundException(`Serviço com UUID ${uuid} não encontrado para esta conta ao tentar deletar.`);
    }
    await this.serviceRepository.remove(service);
  }
}
