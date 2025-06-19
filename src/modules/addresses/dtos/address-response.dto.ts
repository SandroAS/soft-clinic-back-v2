import { Address } from 'src/entities/address.entity';
import { Expose } from 'class-transformer';

export class AddressResponseDto {
  @Expose()
  uuid: string;

  constructor(address: Address) {
    this.uuid = address.uuid;
  }
}
