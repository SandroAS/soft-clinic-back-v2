import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { CreateTrialDto } from '../trials/dtos/create-trial.dto';
import { TrialsService } from '../trials/trials.service';
import { AuthResponseDto } from './dtos/auth-response.dto';

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
    const existingUsers = await this.usersService.findByEmail(email);
    if (existingUsers.length) {
      throw new BadRequestException('E-mail já está em uso, escolha outro.');
    }

    const salt = randomBytes(8).toString('hex');
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hashBuffer.toString('hex');

    let user = await this.usersService.create(email, hashedPassword, 'ADMIN');

    let account = await this.accountsService.create({ admin_id: user.id });

    const now = new Date();
    const trialEndedAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const trialDto: CreateTrialDto = {
      account_id: account.id,
      started_at: now,
      ended_at: trialEndedAt, // 7 dias a mais em relação à data de início do trial
    };
    const trial = await this.trialsService.create(trialDto);
  
    account = await this.accountsService.update(account.id, { last_trial_id: trial.id });

    await this.usersService.update(user.id, { ...user, account_id: account.id });
    account.lastTrial = trial;
    user.account = account;

    const authResponse = new AuthResponseDto(user);
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { user: authResponse, accessToken };
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Senha com formato inválido.');
    }

    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { user, accessToken };
  }
}
