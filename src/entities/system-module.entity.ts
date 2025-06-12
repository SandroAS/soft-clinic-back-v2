import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  ManyToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from './account.entity';

export enum SystemModuleName {
  DENTISTRY = 'DENTISTRY',
  PSYCHOLOGY = 'PSYCHOLOGY',
  NUTRITION = 'NUTRITION',
  PHYSIOTHERAPY = 'PHYSIOTHERAPY',
}

@Entity('system_modules')
export class SystemModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column({
    type: 'enum',
    enum: SystemModuleName,
    unique: true,
  })
  name: SystemModuleName;

  @ManyToMany(() => Account, (account) => account.systemModules)
  accounts: Account[];

  @CreateDateColumn({ name: 'created_at' })

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}