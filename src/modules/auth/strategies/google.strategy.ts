import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from '@/modules/users/users.service';
import { formatFullName } from '@/common/utils/string.utils';

interface GoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: { value: string; verified: boolean }[];
  photos: { value: string }[];
  provider: string;
  _raw: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
  };
}

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
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const email = profile.emails[0].value;
      let user = await this.usersService.findByEmail(email, ['account.lastTrial', 'role.permissions']);

      // if (user && user.google_id) {
      //   throw new BadRequestException('E-mail já está em uso e já foi autenticado com o google, escolha outro.');
      // }

      if (!user) {
        const googleProfile = {
          email,
          profile_img_url: profile.photos[0]?.value || null,
          name: formatFullName(profile.displayName),
          google_id: profile.id,
        };
        user = await this.usersService.create(email, 'ADMIN', null, null, googleProfile);

      } else {
        if (!user.google_id) {
          // Se o usuário existe mas ainda não tem googleId, associe (ex: se ele se registrou com email/senha antes)
          await this.usersService.update(user.id, { google_id: profile.id }, null);
          user.google_id = profile.id;
        }
      }

      // `done` é o callback do Passport. Primeiro argumento é o erro (null se não houver),
      // segundo é o objeto do usuário que será anexado ao `req.user`.
      done(null, user);

    } catch (err) {
      console.error('Erro na estratégia Google:', err);
      done(new InternalServerErrorException('Falha na autenticação Google'), null);
    }
  }
}