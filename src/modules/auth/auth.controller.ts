import { Body, Controller, Get, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { JwtSessionGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/users/decorators/current-user.decorator';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/modules/users/dtos/login.dto';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
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
    // Redireciona para o Google
    console.log('Redirecionando para o Google...');
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request) {
    const user = req.user as User;

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return { user: new AuthResponseDto(user), accessToken };
  }
}
