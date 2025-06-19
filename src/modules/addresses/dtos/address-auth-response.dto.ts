import { Address, BrazilianStates } from 'src/entities/address.entity';
import { Expose } from 'class-transformer';

export class AddressAuthResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  cep: string;

  @Expose()
  street: string;

  @Expose()
  number: string;

  @Expose()
  complement?: string;

  @Expose()
  neighborhood: string;

  @Expose()
  city: string;

  @Expose()
  state: BrazilianStates;

  constructor(address: Address) {
    this.uuid = address.uuid;
    this.cep = address.cep;
    this.street = address.street;
    this.number = address.number;
    this.complement = address.complement;
    this.neighborhood = address.neighborhood;
    this.city = address.city;
    this.state = address.state;
  }
}
