import { Expose, Type } from 'class-transformer';
import { Account } from '@/entities/account.entity';
import { TrialResponseDto } from '@/modules/trials/dtos/trial-response.dto';

export class AccountResponseDto {
  @Expose()
  uuid: string;

  @Expose({ name: 'in_trial' })
  in_trial: boolean;

  @Expose({ name: 'lastTrial' })
  @Type(() => TrialResponseDto)
  lastTrial: TrialResponseDto;

  constructor(partial: Partial<Account>) {
    this.uuid = partial.uuid;
    this.in_trial = partial.in_trial;
    this.lastTrial = null;

    if (partial.lastTrial) {
      this.lastTrial = new TrialResponseDto(partial.lastTrial);
    }
  }
}