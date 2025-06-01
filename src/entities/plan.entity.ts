import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from './subscription.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  is_dynamic: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price_per_professional: number;

  @Column({ type: 'enum', enum: ['monthly', 'yearly'] })
  interval: 'monthly' | 'yearly';

  @Column({ nullable: true })
  user_limit: number;

  @OneToMany(() => Subscription, (sub) => sub.plan)
  subscriptions: Subscription[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
