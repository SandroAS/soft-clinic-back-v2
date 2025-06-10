import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from '@/entities/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(data: CreateAccountDto, manager?: EntityManager): Promise<Account> {
    const accountRepository = manager ? manager.getRepository(Account) : this.accountRepository;
    const account = accountRepository.create(data);
    return accountRepository.save(account);
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
