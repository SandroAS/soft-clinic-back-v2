import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '@/entities/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { SystemModulesService } from '../system-modules/system-modules.service';
import { SystemModuleName } from '@/entities/system-module.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly systemModuleService: SystemModulesService
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

  async findAll(): Promise<Account[]> {
    return this.accountRepository.find();
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
