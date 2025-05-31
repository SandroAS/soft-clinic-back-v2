import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result);

    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { user, accessToken };
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    const payload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { user, accessToken };
  }
}
