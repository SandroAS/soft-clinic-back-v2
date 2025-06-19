import { Company } from '@/entities/company.entity';
import { AddressResponseDto } from '@/modules/addresses/dtos/address-response.dto';
import { Expose } from 'class-transformer';

export class CompanyResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  address: AddressResponseDto

  constructor(partial: Company) {
    this.uuid = partial.uuid;

    if (partial.address) {
      this.address = new AddressResponseDto(partial.address);
    }
  }
}
