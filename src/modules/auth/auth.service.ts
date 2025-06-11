import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, timingSafeEqual, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import AppDataSource from '@/data-source';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { TrialsService } from '../trials/trials.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { User } from '@/entities/user.entity';
import { plainToInstance } from 'class-transformer';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly accountsService: AccountsService,
    private readonly trialsService: TrialsService,
  ) {}

  async signup(email: string, password: string): Promise<{ user: AuthResponseDto; accessToken: string }> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('E-mail já está em uso, escolha outro.');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const salt = randomBytes(8).toString('hex');
      const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;
      const hashedPassword = salt + '.' + hashBuffer.toString('hex');

      const user = await this.usersService.create(email, 'ADMIN', hashedPassword, queryRunner.manager);

      const account = await this.accountsService.create({ admin_id: user.id }, queryRunner.manager);

      const started_at = new Date();
      const ended_at = new Date(started_at.getTime() + 7 * 24 * 60 * 60 * 1000);
      const trial = await this.trialsService.create({ account_id: account.id, started_at, ended_at }, queryRunner.manager);

      await this.accountsService.update(account.id, { last_trial_id: trial.id }, queryRunner.manager);

      await this.usersService.update(user.id, { account_id: account.id }, queryRunner.manager);

      await queryRunner.commitTransaction();

      const authUser = plainToInstance(User, {
        ...user,
        account: { ...account, lastTrial: trial }
      });

      const authResponse = new AuthResponseDto(authUser);
      const payload = { sub: authUser.id, email: authUser.email };
      const accessToken = this.jwtService.sign(payload);

      return { user: authResponse, accessToken };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Erro ao realizar cadastro: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email, ['account.lastTrial', 'role.permissions']);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ao tentar logar.');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (!salt || !storedHash) {
      throw new BadRequestException('Senha salva com formato inválido.');
    }

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Senha com formato inválido.');
    }

    const hashedBuffer = (await scrypt(password, salt, 32)) as Buffer;
    const storedBuffer = Buffer.from(storedHash, 'hex');
    const passwordsMatch = storedBuffer.length === hashedBuffer.length && timingSafeEqual(storedBuffer, hashedBuffer);
    if (!passwordsMatch) {
      throw new BadRequestException('Senha incorreta.');
    }

    const authResponse = new AuthResponseDto(user);
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { user: authResponse, accessToken };
  }
}
