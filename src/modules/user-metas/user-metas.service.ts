import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '@/entities/user.entity';
import { UserMeta } from '@/entities/user-meta.entity';


@Injectable()
export class UserMetasService {
  constructor(
    @InjectRepository(UserMeta)
    private userMetaRepository: Repository<UserMeta>,
  ) {}

  /**
   * Registra meta dados genéricos a um usuário.
   * @param user O objeto User ou o ID do usuário.
   * @param key O referência ao meta dado (ex: 'TERMS_OF_SERVICE', 'PRIVACY_POLICIES').
   * @param value O valor do meta dado (ex: 'ACCEPTED').
   * @param description A descrição opcional da meta data (ex: 'v1.0.0').
   */
  async create(
    user: User | number,
    key: string,
    value: string,
    description: string,
    manager?: EntityManager
  ): Promise<UserMeta> {
    const user_id = typeof user === 'number' ? user : user.id;
    const userMetaRepository = manager ? manager.getRepository(UserMeta) : this.userMetaRepository;
    
    const userMeta = userMetaRepository.create({
      user_id,
      key,
      value,
      description,
    });

    return userMetaRepository.save(userMeta);
  }

  /**
   * Encontra o metadado mais recente para um usuário e chave específica.
   * @param user_id O ID do usuário.
   * @param key O referência genérica a algum meta dado.
   */
  async findLatestUserMeta(
    user_id: number,
    key: string,
  ): Promise<UserMeta | undefined> {
    return this.userMetaRepository.findOne({
      where: { user_id, key },
      order: { created_at: 'DESC' }, // Garante que pegamos o mais recente
    });
  }

  /**
   * Encontra todos os metadados de um usuário.
   * @param user_id O ID do usuário.
   */
  async findAllUserMetas(user_id: number): Promise<UserMeta[]> {
    return this.userMetaRepository.find({
      where: { user_id },
      order: { created_at: 'DESC' },
    });
  }
}
