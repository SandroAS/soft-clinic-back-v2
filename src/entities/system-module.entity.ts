import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from './account.entity';
import { Service } from './service.entity';

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

  @OneToMany(() => Service, (service) => service.systemModule)
  services: Service[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}