import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@/entities/account.entity';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { SystemModulesModule } from '../system-modules/system-modules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    SystemModulesModule
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
