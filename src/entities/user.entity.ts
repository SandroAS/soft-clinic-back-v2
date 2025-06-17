import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BeforeInsert, OneToMany, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { Account } from './account.entity';
import { PaymentIntention } from './payment-intention.entity';
import { Sale } from './sale.entity';
import { Role } from './role.entity';
import { UserMeta } from './user-meta.entity';
import { Company } from './company.entity';
import { Address } from './address.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column({ nullable: true })
  account_id: number;
  
  @ManyToOne(() => Account, (account) => account.users, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  cellphone: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ unique: true, nullable: true })
  google_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'profile_image_url' })
  profile_img_url: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => PaymentIntention, intention => intention.user)
  paymentIntentions: PaymentIntention[];

  @OneToMany(() => Sale, sale => sale.user)
  sales: Sale[];

  @Column()
  role_id: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => UserMeta, (userMeta) => userMeta.user)
  userMetas: UserMeta[];

  @OneToMany(() => Company, company => company.user)
  companies: Company[];

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
