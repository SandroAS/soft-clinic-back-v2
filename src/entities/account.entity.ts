import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { Plan } from './plan.entity';
import { Subscription } from './subscription.entity';
import { Trial } from './trial.entity';
import { PaymentIntention } from './payment-intention.entity';
// import { Sale } from '../entities_/sales.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column()
  admin_id: number;
  
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ nullable: true })
  plan_id: number;
  
  @Column({ nullable: true })
  current_subscription_id: number;

  @OneToOne(() => Subscription, { nullable: true })
  @JoinColumn({ name: 'current_subscription_id' })
  currentSubscription: Subscription;

  @OneToMany(() => Subscription, (sub) => sub.account)
  subscriptions: Subscription[];

  @OneToMany(() => Trial, (trial) => trial.account)
  trials: Trial[];

  @OneToOne(() => Trial, { nullable: true })
  @JoinColumn({ name: 'last_trial_id' })
  lastTrial: Trial;

  @Column({ nullable: true })
  last_trial_id: number;

  @Column({ default: true })
  in_trial: boolean;

  // @OneToMany(() => Sale, (sale) => sale.account)
  // sales: Sale[];

  @OneToMany(() => PaymentIntention, intention => intention.account)
  paymentIntentions: PaymentIntention[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
