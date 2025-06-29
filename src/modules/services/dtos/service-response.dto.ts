import { Exclude, Expose } from 'class-transformer';
import { Service } from '@/entities/service.entity';
import { SystemModuleResponseDto } from '@/modules/system-modules/dtos/system-modules-response.dto';

export class ServiceResponseDto {
  @Exclude()
  id: number;

  @Exclude()
  account_id: number;

  @Exclude()
  system_module_id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  systemModule: SystemModuleResponseDto;

  constructor(partial: Partial<Service>) {
    this.uuid = partial.uuid;
    this.name = partial.name;
    this.description = partial.description;
    this.price = partial.price;

    if (partial.systemModule) {
      this.systemModule = new SystemModuleResponseDto(partial.systemModule);
    }
  }
}
