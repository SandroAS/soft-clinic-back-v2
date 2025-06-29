import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { GoogleProfileParsed } from './dtos/google-profile-parsed.dta';
import { AuthSignupDto } from './dtos/auth-signup';
import { UserMetasService } from '../user-metas/user-metas.service';
import { UserMetasResponseDto } from '../user-metas/dtos/user-metas-response.dto';
import { RolesTypes } from '../roles/dtos/roles-types.dto';
import { ServicesService } from '../services/services.service';
import { SystemModuleName } from '@/entities/system-module.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly accountsService: AccountsService,
    private readonly trialsService: TrialsService,
    private readonly userMetasService: UserMetasService,
    private readonly servicesService: ServicesService
  ) {}

  async whoami(userId: number): Promise<AuthResponseDto> {
    const user = await this.usersService.findOne(userId, ['account.lastTrial', 'account.systemModules', 'role.permissions', 'userMetas', 'companies.address']);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const authResponse = new AuthResponseDto(user);
    return authResponse;
  }

  async signup(controllerProfile?: AuthSignupDto, googleProfile?: GoogleProfileParsed): Promise<{ user: AuthResponseDto; accessToken: string }> {
    if (!controllerProfile && !googleProfile) {
      throw new BadRequestException('Senha ou perfil do Google são obrigatórios para cadastro.');
    }

    const existingUser = await this.usersService.findByEmail(controllerProfile?.email || googleProfile?.email);
    if (existingUser) {
      throw new BadRequestException('E-mail já está em uso, escolha outro.');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let user: User;
      if (controllerProfile && !googleProfile) {
        const salt = randomBytes(8).toString('hex');
        const hashBuffer = (await scrypt(controllerProfile.password, salt, 32)) as Buffer;
        controllerProfile.password = salt + '.' + hashBuffer.toString('hex');

        user = await this.usersService.create(RolesTypes.ADMIN, controllerProfile, null, queryRunner.manager);

        if(controllerProfile.termsAccepted) {
          const termsOfService = await this.userMetasService.create(user.id, 'TERMS_OF_SERVICE', 'ACCEPTED', 'v1.0.0', queryRunner.manager);
          const privacyPolicies = await this.userMetasService.create(user.id, 'PRIVACY_POLICIES', 'ACCEPTED', 'v1.0.0', queryRunner.manager);
          user.userMetas = [termsOfService, privacyPolicies]
        }

      } else {
        user = await this.usersService.create(RolesTypes.ADMIN, null, googleProfile, queryRunner.manager);
      }

      const account = await this.accountsService.create({ admin_id: user.id }, queryRunner.manager);

      const started_at = new Date();
      const ended_at = new Date(started_at.getTime() + 7 * 24 * 60 * 60 * 1000);
      const trial = await this.trialsService.create({ account_id: account.id, started_at, ended_at }, queryRunner.manager);

      await this.accountsService.update(account.id, { last_trial_id: trial.id }, queryRunner.manager);

      await this.usersService.update(user.id, { account_id: account.id }, queryRunner.manager);

      let selectedClinicType: SystemModuleName;
      selectedClinicType = SystemModuleName.DENTISTRY; // FIXO ATE O SISTEM TER DEMAIS MODULOS
      await this.servicesService.createDefaultServicesForNewAccount(selectedClinicType, account.id, queryRunner.manager)

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

  async login(email: string, password?: string, googleProfile?: GoogleProfileParsed): Promise<{ user: AuthResponseDto; accessToken: string }> {
    const user = await this.usersService.findByEmail(email, ['account.lastTrial', 'account.systemModules', 'role.permissions', 'userMetas', 'companies.address']);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ao tentar logar.');
    }

    if (!password && !googleProfile) {
      throw new BadRequestException('Senha ou perfil do Google são obrigatórios para logar.');
    }

    if (password) {
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
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    const authResponse = new AuthResponseDto(user);

    return { user: authResponse, accessToken };
  }

  async termsAccepted(userUuid: string) {
    const user = await this.usersService.findByUuid(userUuid, ['id']);

    if(!user) {
      throw new NotFoundException('Usuário não encontrado ao tentar aprovar os Termos de Serviço e Políticas de Privacidade.');
    }

    const termsOfService = await this.userMetasService.create(user.id, 'TERMS_OF_SERVICE', 'ACCEPTED', 'v1.0.0');
    const privacyPolicies = await this.userMetasService.create(user.id, 'PRIVACY_POLICIES', 'ACCEPTED', 'v1.0.0');
    return [ new UserMetasResponseDto(termsOfService), new UserMetasResponseDto(privacyPolicies) ];
  }
}
