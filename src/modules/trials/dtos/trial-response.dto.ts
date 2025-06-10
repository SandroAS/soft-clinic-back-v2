import { Trial } from '@/entities/trial.entity';
import { Expose } from 'class-transformer';

export class TrialResponseDto {
  @Expose()
  uuid: string;

  @Expose({ name: 'started_at' })
  started_at: Date;

  @Expose({ name: 'ended_at' })
  ended_at: Date;

  constructor(partial: Partial<Trial>) {
    this.uuid = partial.uuid;
    this.started_at = partial.started_at;
    this.ended_at = partial.ended_at;
  }
}