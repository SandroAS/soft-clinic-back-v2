import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Account } from './account.entity';
import { SystemModule } from './system-module.entity';

@Entity('services')
@Index(['name', 'system_module_id', 'account_id'], { unique: true }) 
export class Service extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  account_id: number; 

  @ManyToOne(() => Account, account => account.services)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  system_module_id: number; 

  @ManyToOne(() => SystemModule, systemModule => systemModule.services)
  @JoinColumn({ name: 'system_module_id' })
  systemModule: SystemModule;
}
