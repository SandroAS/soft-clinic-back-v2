import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { SystemModule, SystemModuleName } from '@/entities/system-module.entity';

type SystemModuleColumns = 'id' | 'uuid' | 'name' | 'created_at' | 'updated_at'

@Injectable()
export class SystemModulesService {
  constructor(
    @InjectRepository(SystemModule)
    private systemModuleRepository: Repository<SystemModule>,
  ) {}

  /**
   * Cria um novo módulo de sistema.
   * @param name O nome do módulo (do enum SystemModuleName).
   * @returns O módulo de sistema criado.
   */
  async create(name: SystemModuleName): Promise<SystemModule> {
    const newModule = this.systemModuleRepository.create({ name });
    return this.systemModuleRepository.save(newModule);
  }

  /**
   * Encontra todos os módulos de sistema.
   * @returns Um array de módulos de sistema.
   */
  async findAll(select?: SystemModuleColumns[]): Promise<SystemModule[]> {
    return this.systemModuleRepository.find({ select });
  }

  /**
   * Encontra um módulo de sistema pelo seu ID.
   * @param id O ID do módulo.
   * @returns O módulo de sistema ou null/undefined se não encontrado.
   */
  async findOneById(id: number): Promise<SystemModule | undefined> {
    return this.systemModuleRepository.findOne({ where: { id } });
  }

  /**
   * Encontra um módulo de sistema pelo seu UUID.
   * @param uuid O UUID do módulo.
   * @returns O módulo de sistema ou null/undefined se não encontrado.
   */
  async findOneByUuid(uuid: string, manager?: EntityManager): Promise<SystemModule | undefined> {
    const repository = manager ? manager.getRepository(SystemModule) : this.systemModuleRepository;
    return this.systemModuleRepository.findOne({ where: { uuid } });
  }

  async findByName(name: SystemModuleName, manager?: EntityManager): Promise<SystemModule | undefined> {
    const repository = manager ? manager.getRepository(SystemModule) : this.systemModuleRepository;
    return repository.findOne({ where: { name } });
  }

  /**
   * Encontra um módulo de sistema pelo seu nome.
   * @param name O nome do módulo (do enum SystemModuleName).
   * @returns O módulo de sistema ou null/undefined se não encontrado.
   */
  async findOneByName(name: SystemModuleName): Promise<SystemModule | undefined> {
    return this.systemModuleRepository.findOne({ where: { name } });
  }

  /**
   * Atualiza um módulo de sistema existente.
   * @param id O ID do módulo a ser atualizado.
   * @param newName O novo nome do módulo (do enum SystemModuleName).
   * @returns O módulo de sistema atualizado.
   * @throws NotFoundException se o módulo não for encontrado.
   */
  async update(id: number, newName: SystemModuleName): Promise<SystemModule> {
    const moduleToUpdate = await this.findOneById(id);
    if (!moduleToUpdate) {
      throw new NotFoundException(`SystemModule com ID ${id} não encontrado.`);
    }
    moduleToUpdate.name = newName;
    return this.systemModuleRepository.save(moduleToUpdate);
  }

  /**
   * Remove um módulo de sistema.
   * @param id O ID do módulo a ser removido.
   * @returns Verdadeiro se removido com sucesso, falso caso contrário.
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.systemModuleRepository.delete(id);
    return result.affected > 0;
  }
}
