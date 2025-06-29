import { Expose } from 'class-transformer';
import { SystemModule, SystemModuleName } from '@/entities/system-module.entity';

export class SystemModuleResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  name: SystemModuleName;

  constructor(partial: Partial<SystemModule>) {
    this.uuid = partial.uuid;
    this.name = partial.name;
  }
}
