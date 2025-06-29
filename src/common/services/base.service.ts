import { Repository, DeepPartial, FindManyOptions, FindOneOptions, EntityTarget } from 'typeorm';
import { NotFoundException, Injectable } from '@nestjs/common';
import { BaseEntity } from '../entities/base.entity';
import { PaginationDto } from '../dtos/pagination.dto';

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
    return await this.repository.save(newEntity);
  }

  async findAndPaginate(
    pagination: PaginationDto, 
    searchColumns: string[] = [],
    additionalWhere?: (qb: any) => void
  ): Promise<PaginationResult<T>> {
    const page = parseInt(pagination.page || '1', 10);
    const limit = parseInt(pagination.limit || '10', 10);
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('entity');

    if (additionalWhere) {
      additionalWhere(queryBuilder);
    }

    if (pagination.search_term && searchColumns.length > 0) {
      const searchTerm = `%${pagination.search_term.toLowerCase()}%`;
      const whereConditions = searchColumns.map(col => `LOWER(entity.${col}) LIKE :searchTerm`).join(' OR ');
      queryBuilder.andWhere(`(${whereConditions})`, { searchTerm });
    }

    if (pagination.sort_column) {
      const orderByColumn = `entity.${pagination.sort_column}`;
      const sortOrder = pagination.sort_order === 'desc' ? 'DESC' : 'ASC';
      queryBuilder.orderBy(orderByColumn, sortOrder);
    } else {
      queryBuilder.orderBy('entity.created_at', 'DESC');
    }

    const [data, total] = await Promise.all([
      queryBuilder.offset(skip).limit(limit).getMany(),
      queryBuilder.getCount(),
    ]);

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
      where: { id: id as any },
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
      where: { uuid: uuid as any },
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
