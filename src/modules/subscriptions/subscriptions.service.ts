import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '@/entities/subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      relations: ['account', 'plan', 'sales', 'charges'],
    });
  }

  async findOne(id: number): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['account', 'plan', 'sales', 'charges'],
    });
    if (!subscription) {
      throw new NotFoundException(`Subscription with id ${id} not found`);
    }
    return subscription;
  }

  async create(data: Partial<Subscription>): Promise<Subscription> {
    const subscription = this.subscriptionRepository.create(data);
    return this.subscriptionRepository.save(subscription);
  }

  async update(id: number, data: Partial<Subscription>): Promise<Subscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, data);
    return this.subscriptionRepository.save(subscription);
  }

  async remove(id: number): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.remove(subscription);
  }
}
