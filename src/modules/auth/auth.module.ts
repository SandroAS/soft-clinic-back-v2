import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountsModule } from '../accounts/accounts.module';
import { TrialsModule } from '../trials/trials.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '180d' },
      }),
    }),
    UsersModule,
    AccountsModule,
    TrialsModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
