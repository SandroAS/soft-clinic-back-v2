import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttemptCharge } from '@/entities/attempt-charge.entity';

@Injectable()
export class AttemptChargesService {
  constructor(
    @InjectRepository(AttemptCharge)
    private readonly attemptChargeRepo: Repository<AttemptCharge>,
  ) {}

  async findAll(): Promise<AttemptCharge[]> {
    return this.attemptChargeRepo.find();
  }

  async findById(id: number): Promise<AttemptCharge | null> {
    return this.attemptChargeRepo.findOne({ where: { id } });
  }

  async create(data: Partial<AttemptCharge>): Promise<AttemptCharge> {
    const attempt = this.attemptChargeRepo.create(data);
    return this.attemptChargeRepo.save(attempt);
  }

  async update(id: number, data: Partial<AttemptCharge>): Promise<AttemptCharge> {
    await this.attemptChargeRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.attemptChargeRepo.delete(id);
  }
}
