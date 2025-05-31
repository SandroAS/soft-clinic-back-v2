import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UpdateUserDto } from './dtos/update-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  // async findOne(id: number, relations?: UserRelations[]) {
  async findOne(id: number) {
    let user: User;

    // if (relations && relations.length > 0) {
    //   user = await this.repo.findOne({
    //     where: { id },
    //     relations,
    //   });
    // }

    user = await this.repo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário not found');
    }

    return user;
  }

  findByEmail(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (body.password) {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(body.password, salt, 32)) as Buffer;
      body.password = salt + '.' + hash.toString('hex');
    } else {
      delete body.password
    }

    Object.assign(user, body);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
