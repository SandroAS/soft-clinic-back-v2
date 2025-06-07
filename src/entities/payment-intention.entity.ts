import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AttemptCharge } from './attempt-charge.entity';
import { User } from './user.entity';
import { Account } from './account.entity';

@Entity('payment_intentions')
export class PaymentIntention {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.paymentIntentions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  accountId?: number;

  @ManyToOne(() => Account, account => account.paymentIntentions, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account?: Account;

  @Column()
  status: 'charging' | 'waiting_payment' | 'expired' | 'cancelled' | 'completed';

  @Column({ type: 'decimal' })
  amount: number;

  @Column()
  method: 'credit_card' | 'pix' | 'boleto';

  @Column({ type: 'text', nullable: true })
  pixCopyPaste?: string;

  @Column({ nullable: true })
  qr_code_img_url?: string;

  @Column({ nullable: true })
  bar_code?: string;

  @Column({ nullable: true })
  bar_code_img_url?: string;

  @Column({ nullable: true })
  expires_at: Date;

  @Column({ default: 0 })
  total_attempts: number;

  @Column({ nullable: true })
  sale_id: number;

  // @OneToOne(() => Sale, sale => sale.paymentIntention)
  // sale: Sale;

  @OneToMany(() => AttemptCharge, attempt => attempt.paymentIntention, { cascade: true })
  attemptCharges: AttemptCharge[];

  @Column({ nullable: true })
  parent_intention_id?: number;

  @ManyToOne(() => PaymentIntention, { nullable: true })
  @JoinColumn({ name: 'parent_intention_id' })
  parentIntention?: PaymentIntention;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
