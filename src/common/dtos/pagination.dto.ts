import { IsOptional, IsNumberString, IsIn, IsString } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '10';

  @IsOptional()
  @IsString()
  sort_column?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort_order?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search_term?: string;
};
