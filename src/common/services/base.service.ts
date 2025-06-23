import { Repository, DeepPartial, FindManyOptions, FindOneOptions, EntityTarget } from 'typeorm';
import { NotFoundException, Injectable } from '@nestjs/common';
import { BaseEntity } from '../entities/base.entity';

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  last_page: number;
  limit: number;
}

@Injectable()
export abstract class BaseService<T extends BaseEntity> {

  constructor(protected readonly repository: Repository<T>) {}

  /**
   * Cria uma nova entidade.
   * @param data Dados parciais da entidade a ser criada.
   * @returns A entidade criada e salva.
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const newEntity = this.repository.create(data);
    return await this.repository.save(newEntity as any);
  }

  /**
   * Encontra todas as entidades com paginação e opções de busca/ordenação.
   * @param page Número da página atual.
   * @param limit Quantidade de itens por página.
   * @param options Opções de FindManyOptions do TypeORM (para where, order, relations, etc.).
   * @returns Um objeto com os dados paginados.
   */
  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
    options?: FindManyOptions<T>
  ): Promise<PaginationResult<T>> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      ...options,
      skip,
      take: limit,
    });

    const last_page = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      last_page,
      limit,
    };
  }

  /**
   * Encontra todas as entidades sem paginação.
   * @param options Opções de FindManyOptions do TypeORM.
   * @returns Um array de entidades.
   */
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  /**
   * Encontra uma entidade por sua ID numérica (assumindo 'id' como chave primária numérica).
   * @param id ID numérica da entidade.
   * @param options Opções de FindOneOptions do TypeORM (para relations, etc.).
   * @returns A entidade encontrada ou undefined.
   */
  async findById(id: number, options?: FindOneOptions<T>): Promise<T | undefined> {
    return await this.repository.findOne({
      where: { id: id as any }, // 'id' pode ser string ou number, TypeORM lida
      ...options
    });
  }

  /**
   * Encontra uma entidade por seu UUID.
   * @param uuid UUID da entidade.
   * @param options Opções de FindOneOptions do TypeORM.
   * @returns A entidade encontrada ou undefined.
   */
  async findByUuid(uuid: string, options?: FindOneOptions<T>): Promise<T | undefined> {
    return await this.repository.findOne({
      where: { uuid: uuid as any }, // 'uuid' é string
      ...options
    });
  }

  /**
   * Encontra uma única entidade com opções específicas.
   * @param options Opções de FindOneOptions do TypeORM.
   * @returns A entidade encontrada ou undefined.
   */
  async findOne(options: FindOneOptions<T>): Promise<T | undefined> {
    return await this.repository.findOne(options);
  }

  /**
   * Atualiza uma entidade existente por ID.
   * @param id ID numérica da entidade a ser atualizada.
   * @param data Dados parciais para atualização.
   * @returns A entidade atualizada.
   * @throws NotFoundException se a entidade não for encontrada.
   */
  async update(id: number, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entidade com ID ${id} não encontrada.`);
    }
    Object.assign(entity, data);
    return await this.repository.save(entity as any);
  }

  /**
   * Remove uma entidade por ID.
   * @param id ID numérica da entidade a ser removida.
   * @returns true se a remoção foi bem-sucedida.
   * @throws NotFoundException se a entidade não for encontrada.
   */
  async remove(id: number): Promise<boolean> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entidade com ID ${id} não encontrada.`);
    }
    await this.repository.remove(entity as any);
    return true;
  }
}
