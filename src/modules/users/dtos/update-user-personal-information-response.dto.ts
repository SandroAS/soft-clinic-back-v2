import { IsString, IsOptional } from 'class-validator';

export class UpdateUserPersonalInformationResponseDto {
  @IsString()
  @IsOptional()
  profile_img_url?: string;
}
