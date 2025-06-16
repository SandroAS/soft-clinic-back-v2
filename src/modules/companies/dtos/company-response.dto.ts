import { Company } from '@/entities/company.entity';
import { Expose } from 'class-transformer';

export class CompanyResponseDto {
  @Expose()
  uuid: string;

  @Expose()
  name?: string;

  @Expose()
  social_reason?: string;

  @Expose()
  cnpj?: string;

  @Expose()
  cellphone?: string;

  @Expose()
  email?: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  constructor(company: Company) {
    this.uuid = company.uuid;
    this.name = company.name;
    this.social_reason = company.social_reason;
    this.cnpj = company.cnpj;
    this.cellphone = company.cellphone;
    this.email = company.email;
    this.created_at = company.created_at;
    this.updated_at = company.updated_at;
  }
}
