import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { randomBytes, timingSafeEqual, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RolesTypes } from '../roles/dtos/roles-types.dto';
import { RolesService } from '../roles/roles.service';
import { GoogleProfileParsed } from '../auth/dtos/google-profile-parsed.dta';
import { AuthSignupDto } from '../auth/dtos/auth-signup';
import { UpdateUserPersonalInformationDto } from './dtos/update-user-personal-information.dto';
import { MinioService } from '@/minio/minio.service';
import { UpdateUserPersonalInformationResponseDto } from './dtos/update-user-personal-information-response.dto';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly rolesService: RolesService,
    private readonly minioService: MinioService
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

    let user: User | undefined;

    if (relations && relations.length > 0) {
      user = await userRepository.findOne({
        where: { id },
        relations,
      });
    } else {
      user = await userRepository.findOne({ where: { id } });
    }

    if (user.profile_img_url && !user.profile_img_url.includes('googleusercontent')) {
      try {
        user.profile_img_url = await this.minioService.getPresignedUrl(user.profile_img_url);
      } catch (err) {
        this.minioService['logger'].error(`Falha ao tentar gerar url assinada para usuário, image '${user.profile_img_url}': ${err.message}`);
        user.profile_img_url = null;
      }
    }

    if (relations?.includes('role.permissions') && user.role?.permissions) {
      user.role.permissions = user.role.permissions.map(permission => {
        return permission.name;
      }) as any;
    }

    return user;
  }

  async findByEmail(email: string, relations?: string[]): Promise<User | undefined> {
    if (relations && relations.length > 0) {
      let user: User;
      user = await this.userRepository.findOne({
        where: { email },
        relations,
      });

      if (user.profile_img_url && !user.profile_img_url.includes('googleusercontent')) {
        try {
          user.profile_img_url = await this.minioService.getPresignedUrl(user.profile_img_url);
        } catch (err) {
          this.minioService['logger'].error(`Falha ao tentar gerar url assinada para usuário, image '${user.profile_img_url}': ${err.message}`);
          user.profile_img_url = null;
        }
      }

      if(relations.includes('role.permissions') && user?.role?.permissions) {
        user.role.permissions = user.role.permissions.map(permission => {
          return permission.name;
        }) as any;
      }

      return user;
    }

    return this.userRepository.findOne({ where: { email }, relations: relations || [] });
  }

  async findByUuid(uuid: string, select?: string[]) {
    let user = this.userRepository
    .createQueryBuilder('user')
    .where('user.uuid = :uuid', { uuid });

    if(select) {
      select = select.map(columnName => `user.${columnName}`)
      user.select(select);
    }
    
    return await user.getOne();
  }

  async update(id: number, body: UpdateUserDto, manager?: EntityManager): Promise<User> {
    const userRepository = manager ? manager.getRepository(User) : this.userRepository;
    const user = await this.findOne(id, ['account'], manager);

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

  async updateUserPersonalInformations(
    uuid: string,
    body: UpdateUserPersonalInformationDto,
    file?: Express.Multer.File,
  ): Promise<UpdateUserPersonalInformationResponseDto> {
    const user = await this.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ao tentar atualizar informações pessoais.');
    }

    let newImageUrl: string | null = null;
    let newProfileObjectName: string | null = null;

    if (file) {
      if (user.profile_img_url && !user.profile_img_url.includes('googleusercontent')) {
        try {
          await this.minioService.removeFile(user.profile_img_url);
        } catch (removeError) {
          console.error(`Failed to remove old profile image '${user.profile_img_url}': ${removeError.message}`);
        }
      }

      newProfileObjectName = await this.minioService.uploadFile(file, 'profile-images');
      newImageUrl = await this.minioService.getPresignedUrl(newProfileObjectName);
    } else {
      if (user.profile_img_url && !user.profile_img_url.includes('googleusercontent')) {
        newProfileObjectName = user.profile_img_url;
        newImageUrl = await this.minioService.getPresignedUrl(newProfileObjectName);
      }
    }

    user.profile_img_url = newProfileObjectName;

    Object.assign(user, body);
    await this.userRepository.save(user);

    return { profile_img_url: newImageUrl };
  }

  async updateUserPassword(uuid: string, body: UpdateUserPasswordDto, user: User): Promise<boolean> {
    try {

      if(user.password) {
        const [salt, storedHash] = user.password.split('.');
        const hashedBuffer = (await scrypt(body.current_password, salt, 32)) as Buffer;
        const storedBuffer = Buffer.from(storedHash, 'hex');
        const passwordsMatch = storedBuffer.length === hashedBuffer.length && timingSafeEqual(storedBuffer, hashedBuffer);
        if (!passwordsMatch) {
          throw new BadRequestException('Senha atual cadastrada não conincide com a senha atual informada.');
        }
      }

      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(body.new_password, salt, 32)) as Buffer;
      user.password = salt + '.' + hash.toString('hex');

      Object.assign(user, body);
      await this.userRepository.save(user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado ao tentar remover.');
    }
    return this.userRepository.remove(user);
  }
}
