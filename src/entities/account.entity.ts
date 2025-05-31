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
} from 'typeorm';

import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { Plan } from '@/plans/entities/plan.entity';
import { User } from './user.entity';
import { Trial } from './trial.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true, default: () => 'UUID()' })
  uuid: string;

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

  // Assinatura atual ativa (pode ser nula)
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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
