import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { Address } from './address.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column({  nullable: false })
  user_id: number;

  @ManyToOne(() => User, user => user.companies, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, name: 'social_reason' })
  social_reason: string;

  @Column({ unique: true, nullable: true })
  cnpj: string;

  @Column({ nullable: true })
  cellphone: string;

  @Column({ nullable: true })
  email: string;

  @OneToOne(() => Address, { cascade: true, eager: true, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @Column({ nullable: true, name: 'address_id' })
  address_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
