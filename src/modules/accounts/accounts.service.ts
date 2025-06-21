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

const scrypt = promisify(_scrypt);

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly systemModuleService: SystemModulesService,
    private readonly minioService: MinioService,
    private readonly usersService: UsersService
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

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const salt = randomBytes(8).toString('hex');
      const hashBuffer = (await scrypt(accountUser.password, salt, 32)) as Buffer;
      accountUser.password = salt + '.' + hashBuffer.toString('hex');

      const account = await this.findOne(user.account_id, queryRunner.manager);

      const userCreated = await this.usersService.createSecondaryUser(RolesTypes.ADMIN, accountUser, account.id, queryRunner.manager);

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

    accountUsers.users = await Promise.all(accountUsers.users.map(async user => {
      if (user.profile_img_url && !user.profile_img_url.includes('googleusercontent')) {
        try {
          user.profile_img_url = await this.minioService.getPresignedUrl(user.profile_img_url);
          return user;
        } catch (err) {
          this.minioService['logger'].error(`Falha ao tentar gerar url assinada para usuário, image '${user.profile_img_url}': ${err.message}`);
          user.profile_img_url = null;
          return user;
        }
      }
    }));

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

  async remove(id: number): Promise<void> {
    const account = await this.findOne(id);

    if (!account) {
      throw new NotFoundException('Conta não encontrada ao tentar remover.');
    }

    await this.accountRepository.remove(account);
  }
}
