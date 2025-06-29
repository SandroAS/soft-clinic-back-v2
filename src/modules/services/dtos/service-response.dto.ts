import { Exclude, Expose } from 'class-transformer';
import { Service } from '@/entities/service.entity';

export class ServiceResponseDto {
  @Exclude()
  id: number;

  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  constructor(partial: Partial<Service>) {
    Object.assign(this, partial);
  }
}
