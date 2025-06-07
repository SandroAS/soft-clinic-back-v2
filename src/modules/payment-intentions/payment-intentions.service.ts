import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentIntention } from '@/entities/payment-intention.entity';

@Injectable()
export class PaymentIntentionsService {
  constructor(
    @InjectRepository(PaymentIntention)
    private readonly repo: Repository<PaymentIntention>,
  ) {}

  async findAll(): Promise<PaymentIntention[]> {
    return this.repo.find({ relations: ['user', 'account', 'attemptCharges', 'parentIntention'] });
  }

  async findOne(id: number): Promise<PaymentIntention> {
    const item = await this.repo.findOne({
      where: { id },
      relations: ['user', 'account', 'attemptCharges', 'parentIntention'],
    });

    if (!item) throw new NotFoundException('Payment Intention not found');
    return item;
  }

  async create(data: Partial<PaymentIntention>): Promise<PaymentIntention> {
    const paymentIntention = this.repo.create(data);
    return this.repo.save(paymentIntention);
  }

  async update(id: number, data: Partial<PaymentIntention>): Promise<PaymentIntention> {
    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
