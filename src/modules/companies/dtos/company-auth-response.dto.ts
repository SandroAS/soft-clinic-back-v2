import { Company } from '@/entities/company.entity';
import { AddressResponseDto } from '@/modules/addresses/dtos/address-response.dto';
import { Expose } from 'class-transformer';

export class CompanyAuthResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  name: string;

  @Expose()
  social_reason: string;

  @Expose()
  cnpj: string;

  @Expose()
  cellphone: string;

  @Expose()
  email: string;

  @Expose()
  address: AddressResponseDto;

  constructor(partial: Company) {
    this.uuid = partial.uuid;
    this.name = partial.name;
    this.social_reason = partial.social_reason;
    this.cnpj = partial.cnpj;
    this.cellphone = partial.cellphone;
    this.email = partial.email;

    if (partial.address) {
      this.address = new AddressResponseDto(partial.address);
    }
  }
}
