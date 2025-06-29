import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from '@/entities/service.entity';
import { SystemModulesModule } from '../system-modules/system-modules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    SystemModulesModule
  ],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
