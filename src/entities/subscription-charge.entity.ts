import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, JoinColumn, OneToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from './subscription.entity';
import { Sale } from './sale.entity';

export type ChargeStatus = 'open' | 'paid' | 'failed';

@Entity('subscription_charges')
export class SubscriptionCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column({ nullable: true })
  subscription_id: number;

  @ManyToOne(() => Subscription, (subscription) => subscription.charges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ nullable: true })
  sale_id: number;

  @OneToOne(() => Sale, { nullable: true })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['open', 'paid', 'failed'], default: 'open' })
  status: ChargeStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
