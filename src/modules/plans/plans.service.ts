import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '@/entities/plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Plan[]> {
    return this.planRepository.find();
  }

  async findOne(id: number): Promise<Plan> {
    const plan = await this.planRepository.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException(`Plan with id ${id} not found`);
    }
    return plan;
  }

  async create(data: Partial<Plan>): Promise<Plan> {
    const plan = this.planRepository.create(data);
    return this.planRepository.save(plan);
  }

  async update(id: number, data: Partial<Plan>): Promise<Plan> {
    const plan = await this.findOne(id);
    Object.assign(plan, data);
    return this.planRepository.save(plan);
  }

  async remove(id: number): Promise<void> {
    const plan = await this.findOne(id);
    await this.planRepository.remove(plan);
  }
}
