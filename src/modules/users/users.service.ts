import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RolesTypes } from '../roles/dtos/roles-types.dto';
import { RolesService } from '../roles/roles.service';
import { GoogleProfileParsed } from '../auth/dtos/google-profile-parsed.dta';
import { AuthSignupDto } from '../auth/dtos/auth-signup';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create(roleName: RolesTypes, controllerProfile?: AuthSignupDto, googleProfile?: GoogleProfileParsed, manager?: EntityManager): Promise<User> {
    const userRepository = manager ? manager.getRepository(User) : this.userRepository;
    const role = await this.rolesService.findByName(roleName);

    if (!role) {
      throw new NotFoundException('Role não encontrada');
    }

    let user: User;
    if (googleProfile) {
      const { google_id, email, name, profile_img_url } = googleProfile;
      user = userRepository.create({ role, email, google_id, name, profile_img_url });
    } else {
      if (!controllerProfile) {
        throw new BadRequestException('A senha é obrigatória para cadastro sem ser por autenticação com Google.');
      }
      const { email, password, name, cellphone, cpf } = controllerProfile;
      user = userRepository.create({ role, email, password, name, cellphone, cpf });
    }

    user.role.permissions = role.permissions;

    return userRepository.save(user);
  }

  async findOne(id: number, relations?: string[], manager?: EntityManager): Promise<User | undefined> {
    const userRepository = manager ? manager.getRepository(User) : this.userRepository;

    if (relations && relations.length > 0) {
      let user: User;
      user = await userRepository.findOne({
        where: { id },
        relations,
      });

      if(relations.includes('role.permissions') && user?.role?.permissions) {
        user.role.permissions = user.role.permissions.map(permission => {
          return permission.name;
        }) as any;
      }

      return user;
    }

    return await userRepository.findOne({ where: { id }, relations: relations || [] });
  }

  async findByEmail(email: string, relations?: string[]): Promise<User | undefined> {
    if (relations && relations.length > 0) {
      let user: User;
      user = await this.userRepository.findOne({
        where: { email },
        relations,
      });

      if(relations.includes('role.permissions') && user?.role?.permissions) {
        user.role.permissions = user.role.permissions.map(permission => {
          return permission.name;
        }) as any;
      }

      return user;
    }

    return this.userRepository.findOne({ where: { email }, relations: relations || [] });
  }

  async update(id: number, body: UpdateUserDto, manager?: EntityManager): Promise<User> {
    const userRepository = manager ? manager.getRepository(User) : this.userRepository;
    const user = await this.findOne(id, ['account'], manager);
    console.log('user', id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado ao tentar atualizar.');
    }

    if (body.password) {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(body.password, salt, 32)) as Buffer;
      body.password = salt + '.' + hash.toString('hex');
    } else {
      delete body.password
    }

    Object.assign(user, body);
    return userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado ao tentar remover.');
    }
    return this.userRepository.remove(user);
  }
}
