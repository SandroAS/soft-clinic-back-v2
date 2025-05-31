import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity('trials')
export class Trial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, default: () => 'UUID()' })
  uuid: string;

  @Column()
  started_at: Date;

  @Column({ nullable: true })
  ended_at: Date;

  @ManyToOne(() => Account, (account) => account.trials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  account_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
