import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionCharge } from '@/entities/subscription-charge.entity';

@Injectable()
export class SubscriptionChargesService {
  constructor(
    @InjectRepository(SubscriptionCharge)
    private readonly chargeRepository: Repository<SubscriptionCharge>,
  ) {}

  async findAll(): Promise<SubscriptionCharge[]> {
    return this.chargeRepository.find({
      relations: ['subscription', 'sale'],
    });
  }

  async findOne(id: number): Promise<SubscriptionCharge> {
    const charge = await this.chargeRepository.findOne({
      where: { id },
      relations: ['subscription', 'sale'],
    });
    if (!charge) {
      throw new NotFoundException(`Charge with id ${id} not found`);
    }
    return charge;
  }

  async create(data: Partial<SubscriptionCharge>): Promise<SubscriptionCharge> {
    const charge = this.chargeRepository.create(data);
    return this.chargeRepository.save(charge);
  }

  async update(id: number, data: Partial<SubscriptionCharge>): Promise<SubscriptionCharge> {
    const charge = await this.findOne(id);
    Object.assign(charge, data);
    return this.chargeRepository.save(charge);
  }

  async remove(id: number): Promise<void> {
    const charge = await this.findOne(id);
    await this.chargeRepository.remove(charge);
  }
}
