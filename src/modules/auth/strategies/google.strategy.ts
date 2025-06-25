import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from '@/modules/users/users.service';
import { formatFullName } from '@/common/utils/string.utils';
import { GoogleProfile } from '../dtos/google-profile.dta';
import { GoogleProfileParsed } from '../dtos/google-profile-parsed.dta';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('APP_URL')}/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  // O método `validate` é chamado após o Google autenticar o usuário e redirecionar para seu callback URL
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    // `done` é o callback do Passport. Primeiro argumento é o erro (null se não houver),
    // segundo é o objeto do usuário que será anexado ao `req.user`, esse "user" é uma chave reservada do objeto "req".
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const email = profile.emails[0].value;
      let userFoundByEmail = await this.usersService.findByEmail(email, ['account.lastTrial', 'account.systemModules', 'role.permissions', 'userMetas', 'companies.address']);

      const googleProfile: GoogleProfileParsed = {
        google_id: profile.id,
        email,
        name: formatFullName(profile.displayName),
        profile_img_url: profile.photos[0]?.value || null,
      };

      if (!userFoundByEmail) {
        const { user, accessToken } = await this.authService.signup(null, googleProfile);
        done(null, { user, accessToken });
      } else {
        if (!userFoundByEmail.google_id) {
          // Se o usuário existe mas ainda não tem googleId, associa (ex: se ele se registrou com email/senha antes)
          await this.usersService.update(userFoundByEmail.id, {
            google_id: profile.id,
            profile_img_url: userFoundByEmail.profile_img_url || googleProfile.profile_img_url
          }, null);
          userFoundByEmail.google_id = profile.id;
          userFoundByEmail.profile_img_url = userFoundByEmail.profile_img_url || googleProfile.profile_img_url;
        }

        const { user, accessToken } = await this.authService.login(email, null, googleProfile);
        done(null, { user, accessToken });
      }


    } catch (err) {
      console.error('Erro na estratégia Google:', err);
      done(new InternalServerErrorException('Falha na autenticação Google'), null);
    }
  }
}