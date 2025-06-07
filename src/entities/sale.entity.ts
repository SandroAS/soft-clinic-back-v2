import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../entities/account.entity';
import { Subscription } from '../entities/subscription.entity';
import { Plan } from '../entities/plan.entity';
import { SubscriptionCharge } from './subscription-charge.entity';
import { User } from './user.entity';

export type SaleType = 'subscription' | 'one_time' | 'service';
export type PaymentMethod = 'CREDIT_CARD' | 'BOLETO' | 'PIX';
export type SaleStatus = 'paid' |  'waiting_refund' | 'refunded' | 'chargeback';
export type GatewayProvider = 'PAGARME';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  account_id: number;

  @ManyToOne(() => Account, (account) => account.sales, { nullable: true })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ nullable: true })
  plan_id: number;

  @ManyToOne(() => Plan, (plan) => plan.sales, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ nullable: true })
  subscription_id: number;

  @ManyToOne(() => Subscription, (sub) => sub.sales, { nullable: true })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ nullable: true })
  subscription_charge_id: number;

  @OneToOne(() => SubscriptionCharge, subscriptionCharge => subscriptionCharge.sale, { cascade: true, eager: true })
  @JoinColumn({ name: 'subscription_charge_id' })
  subscriptionCharge: SubscriptionCharge;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ type: 'enum', enum: ['subscription', 'one_time', 'service'] })
  type: SaleType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  original_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  gateway_fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: ['CREDIT_CARD', 'BOLETO', 'PIX'] })
  method: PaymentMethod;

  @Column({ type: 'int', default: 1 })
  installments: number;

  @Column({ type: 'enum', enum: ['PAGARME'] })
  gateway: GatewayProvider;

  @Column({ type: 'enum', enum: ['paid', 'waiting_refund', 'refunded', 'chargeback'], default: 'paid' })
  status: SaleStatus;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date | null;

  @Column({ type: 'text', nullable: true })
  failed_reason: string | null;

  @Column({ nullable: true })
  refund_solicitation_id: number;

  @Column({ type: 'timestamp', nullable: true })
  refund_solicitation_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  refunded_at: Date | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
