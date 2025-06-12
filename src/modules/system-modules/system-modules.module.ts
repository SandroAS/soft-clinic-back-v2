import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModule } from '@/entities/system-module.entity';
import { SystemModulesService } from './system-modules.service';
import { SystemModulesController } from './system-modules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SystemModule])],
  providers: [SystemModulesService],
  controllers: [SystemModulesController],
  exports: [SystemModulesService],
})
export class SystemModulesModule {}
