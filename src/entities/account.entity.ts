import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { Trial } from './trial.entity';
import { Plan } from './plan.entity';
import { Subscription } from './subscription.entity';

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

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'admin_id' })
  admin: User;

  @Column()
  admin_id: number;

  @OneToMany(() => User, (user) => user.account)
  users: User[];

  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ nullable: true })
  plan_id: number;

  @OneToOne(() => Subscription, { nullable: true })
  @JoinColumn({ name: 'current_subscription_id' })
  currentSubscription: Subscription;

  @Column({ nullable: true })
  current_subscription_id: number;

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
