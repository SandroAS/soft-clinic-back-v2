import { Expose, Type } from 'class-transformer';
import { Account } from '@/entities/account.entity';
import { TrialResponseDto } from '@/modules/trials/dtos/trial-response.dto';
import { SystemModuleResponseDto } from '@/modules/system-modules/dtos/system-modules-response.dto';

export class AccountResponseDto {
  @Expose()
  uuid: string;

  @Expose({ name: 'in_trial' })
  in_trial: boolean;

  @Expose({ name: 'lastTrial' })
  @Type(() => TrialResponseDto)
  lastTrial: TrialResponseDto;

  @Expose({ name: 'systemModules' })
  @Type(() => SystemModuleResponseDto)
  systemModules: SystemModuleResponseDto[];

  constructor(partial: Partial<Account>) {
    this.uuid = partial.uuid;
    this.in_trial = partial.in_trial;
    this.lastTrial = null;
    this.systemModules = [];

    if (partial.lastTrial) {
      this.lastTrial = new TrialResponseDto(partial.lastTrial);
    }

    if (partial.systemModules && partial.systemModules.length > 0) {
      this.systemModules = partial.systemModules.map(
        (module) => new SystemModuleResponseDto(module)
      );
    }
  }
}
