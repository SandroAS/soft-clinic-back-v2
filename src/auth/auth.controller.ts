import { Body, Controller, Get, Post, Session, UseGuards } from '@nestjs/common';
import { JwtSessionGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/users/dtos/login.dto';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    delete user.password;
    return { user, accessToken };
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const { user, accessToken } = await this.authService.login(
      body.email,
      body.password,
    );
    delete user.password;
    return { user, accessToken };
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userId = null;
    return { message: 'Logout successful' };
  }
}
