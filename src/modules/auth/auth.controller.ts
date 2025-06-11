import { Body, Controller, Get, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { JwtSessionGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/users/decorators/current-user.decorator';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/modules/users/dtos/login.dto';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get('/whoami')
  @UseGuards(JwtSessionGuard)
  whoAmI(@CurrentUser() user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const { user, accessToken } = await this.authService.signup(
      body.email,
      body.password
    );
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
    const user = req.user as User;

    if (user) {
      const payload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      return res.redirect(`${this.configService.get<string>('APP_URL_FRONT')}/auth/google-auth-callback?user=${JSON.stringify(new AuthResponseDto(user))}&token=${accessToken}`);
    }

    // Caso não haja usuário (erro na estratégia, etc.)
    console.error('Erro na autenticação Google: Usuário não encontrado após redirecionamento.');
    return res.redirect(`${this.configService.get<string>('APP_URL')}/auth/login?error=google_auth_failed`);
  }
}
