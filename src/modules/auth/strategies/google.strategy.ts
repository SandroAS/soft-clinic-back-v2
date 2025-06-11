import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UsersService } from '@/modules/users/users.service';

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
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('Google Profile:', profile);

//     Google Profile: {
// 2025-06-11 17:49:51 soft-clinic-nest   |   id: '103568965503549818658',
// 2025-06-11 17:49:51 soft-clinic-nest   |   displayName: 'sandro souza',
// 2025-06-11 17:49:51 soft-clinic-nest   |   name: { familyName: 'souza', givenName: 'sandro' },
// 2025-06-11 17:49:51 soft-clinic-nest   |   emails: [ { value: 'sandroantoniosouza98@gmail.com', verified: true } ],
// 2025-06-11 17:49:51 soft-clinic-nest   |   photos: [
// 2025-06-11 17:49:51 soft-clinic-nest   |     {
// 2025-06-11 17:49:51 soft-clinic-nest   |       value: 'https://lh3.googleusercontent.com/a/ACg8ocIkqRnlOg9uVidTP2yG1SG7DCuBWpVWIuJUTHk7MKfwE-ngPWvSXg=s96-c'
// 2025-06-11 17:49:51 soft-clinic-nest   |     }
// 2025-06-11 17:49:51 soft-clinic-nest   |   ],
// 2025-06-11 17:49:51 soft-clinic-nest   |   provider: 'google',
// 2025-06-11 17:49:51 soft-clinic-nest   |   _raw: '{\n' +
// 2025-06-11 17:49:51 soft-clinic-nest   |     '  "sub": "103568965503549818658",\n' +
// 2025-06-11 17:49:51 soft-clinic-nest   |     '  "name": "sandro souza",\n' +
// 2025-06-11 17:49:51 soft-clinic-nest   |     '  "given_name": "sandro",\n' +
// 2025-06-11 17:49:51 soft-clinic-nest   |     '  "family_name": "souza",\n' +
// 2025-06-11 17:49:51 soft-clinic-nest   |     '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocIkqRnlOg9uVidTP2yG1SG7DCuBWpVWIuJUTHk7MKfwE-ngPWvSXg\\u003ds96-c",\n' +
// 2025-06-11 17:49:51 soft-clinic-nest   |     '  "email": "sandroantoniosouza98@gmail.com",\n' +
// 2025-06-11 17:49:51 soft-clinic-nest   |     '  "email_verified": true\n' +
// 2025-06-11 17:49:51 soft-clinic-nest   |     '}',
// 2025-06-11 17:49:51 soft-clinic-nest   |   _json: {
// 2025-06-11 17:49:51 soft-clinic-nest   |     sub: '103568965503549818658',
// 2025-06-11 17:49:51 soft-clinic-nest   |     name: 'sandro souza',
// 2025-06-11 17:49:51 soft-clinic-nest   |     given_name: 'sandro',
// 2025-06-11 17:49:51 soft-clinic-nest   |     family_name: 'souza',
// 2025-06-11 17:49:51 soft-clinic-nest   |     picture: 'https://lh3.googleusercontent.com/a/ACg8ocIkqRnlOg9uVidTP2yG1SG7DCuBWpVWIuJUTHk7MKfwE-ngPWvSXg=s96-c',
// 2025-06-11 17:49:51 soft-clinic-nest   |     email: 'sandroantoniosouza98@gmail.com',
// 2025-06-11 17:49:51 soft-clinic-nest   |     email_verified: true
// 2025-06-11 17:49:51 soft-clinic-nest   |   }
// 2025-06-11 17:49:51 soft-clinic-nest   | }
    const { name, emails, photos, id: googleId } = profile;

    try {
      const email = emails[0].value;
      let user = await this.usersService.findByEmail(email, ['account.lastTrial', 'role.permissions']);

      // if (user && user.google_id) {
      //   throw new BadRequestException('E-mail já está em uso e já foi autenticado com o google, escolha outro.');
      // }

      if (!user) {
        const googleProfile = {
          photos,
          email: email,
          name: name.givenName + ' ' + name.familyName,
          google_id: googleId,
        };
        user = await this.usersService.create(email, 'ADMIN', null, null, googleProfile);

      } else {
        if (!user.google_id) {
          // Se o usuário existe mas ainda não tem googleId, associe (ex: se ele se registrou com email/senha antes)
          await this.usersService.update(user.id, { google_id: googleId }, null);
          user.google_id = googleId;
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