import { Module, MiddlewareConsumer } from '@nestjs/common';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@/entities/user.entity';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { CurrentUserMiddleware } from './middlewares/current-user.middlewares';
import { RolesModule } from '../roles/roles.module';
import { MinioModule } from '@/minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    MinioModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor
    // }
  ],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
