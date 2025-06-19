import { Company } from '@/entities/company.entity';
import { Expose } from 'class-transformer';

export class CompanyResponseDto {
  @Expose()
  uuid: string;

  constructor(company: Company) {
    this.uuid = company.uuid;
  }
}
