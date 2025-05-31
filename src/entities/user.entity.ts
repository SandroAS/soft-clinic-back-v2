import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Account } from './account.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, default: () => 'UUID()' })
  uuid: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  cellphone: string;

  @Column({ nullable: true })
  cpf: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToOne(() => Account, (account) => account.users)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column()
  account_id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
