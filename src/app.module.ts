import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { PlansModule } from './modules/plans/plans.module';
import { TrialsModule } from './modules/trials/trials.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { SubscriptionChargesModule } from './modules/subscription-charges/subscription-charges.module';
import { PaymentIntentionsModule } from './modules/payment-intentions/payment-intentions.module';
import { AttemptChargesModule } from './modules/attempt-charges/attempt-charges.module';
import { SalesModule } from './modules/sales/sales.module';
import { UserMetasModule } from './modules/user-metas/user-metas.module';
import { SystemModulesModule } from './modules/system-modules/system-modules.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { AddressesModule } from './modules/addresses/addresses.module';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}`,
        '.env'
      ]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false
      })
    }),
    UsersModule,
    AuthModule,
    AccountsModule,
    RolesModule,
    PermissionsModule,
    PlansModule,
    TrialsModule,
    SubscriptionsModule,
    SubscriptionChargesModule,
    PaymentIntentionsModule,
    AttemptChargesModule,
    SalesModule,
    UserMetasModule,
    SystemModulesModule,
    CompaniesModule,
    AddressesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ]
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')]
        })
      )
      .forRoutes('*');
  }
}

