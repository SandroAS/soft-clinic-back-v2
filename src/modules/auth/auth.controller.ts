import { Body, Controller, Get, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/users/decorators/current-user.decorator';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/modules/users/dtos/login.dto';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { ConfigService } from '@nestjs/config';
import { AuthSignupDto } from './dtos/auth-signup';
import { UserMetasResponseDto } from '../user-metas/dtos/user-metas-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('/whoami')
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.authService.whoami(user.id);
  }

  @Post('/signup')
  async createUser(@Body() body: AuthSignupDto) {
    const { user, accessToken } = await this.authService.signup(body);
    return { user, accessToken };
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const { user, accessToken } = await this.authService.login(
      body.email,
      body.password,
    );
    return { user, accessToken };
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
    return { message: 'Logout successful' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    console.log('Redirecionando para o Google...');
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { user, accessToken } = req.user as { user: AuthResponseDto, accessToken: string };

    if (user && accessToken) {
      return res.redirect(`${this.configService.get<string>('APP_URL_FRONT')}/auth/google-auth-callback?token=${accessToken}`);
    }

    console.error('Erro na autenticação Google: Usuário ou accessToken não encontrado após redirecionamento.');
    return res.redirect(`${this.configService.get<string>('APP_URL_FRONT')}/auth/login?error=google_auth_failed`);
  }

  @Post('/terms-accepted')
  async termsAccepted(@Body() body: { userUuid: string }) {
    const userMetas: UserMetasResponseDto[] = await this.authService.termsAccepted(body.userUuid);
    return userMetas;
  }
}
