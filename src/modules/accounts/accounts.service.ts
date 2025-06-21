import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '@/entities/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { SystemModulesService } from '../system-modules/system-modules.service';
import { SystemModuleName } from '@/entities/system-module.entity';
import { User } from '@/entities/user.entity';
import { AccountUsersResponseDto } from './dtos/account-users-response.dto';
import { MinioService } from '@/minio/minio.service';
import { CreateAccountUserDto } from './dtos/create-account-user.dto';
import { UsersService } from '../users/users.service';
import AppDataSource from '@/data-source';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { RolesTypes } from '../roles/dtos/roles-types.dto';
import { UpdateAccountUserDto } from './dtos/update-account-user-dto';
import { RolesService } from '../roles/roles.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly systemModuleService: SystemModulesService,
    private readonly minioService: MinioService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService
  ) {}

  async create(data: CreateAccountDto, manager?: EntityManager): Promise<Account> {
    const accountRepository = manager ? manager.getRepository(Account) : this.accountRepository;

    const dentistryModule = await this.systemModuleService.findOneByName(SystemModuleName.DENTISTRY);
    if (!dentistryModule) {
      throw new NotFoundException(`Módulo do Sistema ${SystemModuleName.DENTISTRY} não encontrado.`);
    }

    const account = accountRepository.create(data);
    account.systemModules = account.systemModules || [];
    account.systemModules.push(dentistryModule);

    const savedAccount = await accountRepository.save(account);
    savedAccount.systemModules = account.systemModules;
    return savedAccount;
  }

  async createAccountUser(accountUser: CreateAccountUserDto, user: User) {
    const existingUser = await this.usersService.findByEmail(accountUser.email);
    if (existingUser) {
      throw new BadRequestException('E-mail já está em uso, escolha outro.');
    }

    if(accountUser.role === RolesTypes.ADMIN) {
      throw new BadRequestException('Uma conta só pode ter um único usuário ADMIN.');
    }

    if(accountUser.role === RolesTypes.SUPER_ADMIN) {
      throw new BadRequestException('Não é possível cadastrar novos usuários SUPER_ADMIN no sistema.');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const salt = randomBytes(8).toString('hex');
      const hashBuffer = (await scrypt(accountUser.password, salt, 32)) as Buffer;
      accountUser.password = salt + '.' + hashBuffer.toString('hex');

      const account = await this.findOne(user.account_id, queryRunner.manager);

      const userCreated = await this.usersService.createSecondaryUser(RolesTypes[accountUser.role], accountUser, account.id, queryRunner.manager);

      await queryRunner.commitTransaction();

      return { uuid: userCreated.uuid, role: { uuid: userCreated.role.uuid } };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Erro ao realizar cadastro de usuário: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async findAllAccountUsers(user: User): Promise<AccountUsersResponseDto> {
    const accountUsers: Account = await this.accountRepository.findOne({ where: { id: user.account_id }, relations: ['users.role'] });

    if (!accountUsers) {
      throw new NotFoundException('Conta não encontrada ao tentar buscar usuários relacionados a ela.');
    }

    const usersWithPresignedUrls = await Promise.all(
      accountUsers.users.map(async (u) => {
        // Clone the user instance to preserve class methods
        const userInstance = Object.setPrototypeOf({ ...u }, User.prototype);

        if (userInstance.profile_img_url && !userInstance.profile_img_url.includes('googleusercontent')) {
          try {
            userInstance.profile_img_url = await this.minioService.getPresignedUrl(userInstance.profile_img_url);
            return userInstance;
          } catch (err) {
            this.minioService['logger'].error(`Falha ao tentar gerar url assinada para usuário, imagem '${userInstance.profile_img_url}': ${err.message}`);
            userInstance.profile_img_url = null;
            return userInstance;
          }
        }
        return userInstance;
      }),
    );

    accountUsers.users = usersWithPresignedUrls as User[];

    return new AccountUsersResponseDto(accountUsers);
  }

  async findOne(id: number, manager?: EntityManager): Promise<Account> {
    const accountRepository = manager ? manager.getRepository(Account) : this.accountRepository;
    const account = await accountRepository.findOne({ where: { id } });

    return account;
  }

  async update(id: number, data: UpdateAccountDto, manager?: EntityManager): Promise<Account> {
    const accountRepository = manager ? manager.getRepository(Account) : this.accountRepository;
    const account = await this.findOne(id, manager);

    if (!account) {
      throw new NotFoundException('Conta não encontrada ao tentar atualizar.');
    }

    Object.assign(account, data);
    return accountRepository.save(account);
  }

  async updateAccountUser(uuid: string, accountUser: UpdateAccountUserDto, authUser: User) {
    const user = await this.usersService.findByUuid(uuid);
    const role = await this.rolesService.findByName(accountUser.role);

    if (!role) {
      throw new NotFoundException('Tipo de usuário não encontrado');
    }

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ao tentar atualizar.');
    }

    Object.assign(user, accountUser);
    await this.usersService.update(user.id, user);
    return { uuid, role: { uuid: role.uuid } };
  }

  async remove(id: number): Promise<void> {
    const account = await this.findOne(id);

    if (!account) {
      throw new NotFoundException('Conta não encontrada ao tentar remover.');
    }

    await this.accountRepository.remove(account);
  }
}
