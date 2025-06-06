import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PaymentIntention } from './payment-intention.entity';

export type GatewayProvider = 'PAGARME';

@Entity('attempt_charges')
export class AttemptCharge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column()
  payment_intention_id: number;

  @ManyToOne(() => PaymentIntention, intention => intention.attemptCharges)
  @JoinColumn({ name: 'payment_intention_id' })
  paymentIntention: PaymentIntention;

  @Column()
  status: 'pending' | 'failed' | 'success';

  @Column({ type: 'decimal' })
  amount: number;

  @Column()
  method: 'credit_card' | 'pix' | 'boleto';

  @Column({ type: 'enum', enum: ['PAGARME'] })
  gateway: GatewayProvider;

  @Column()
  attempt_number: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  attempt_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
