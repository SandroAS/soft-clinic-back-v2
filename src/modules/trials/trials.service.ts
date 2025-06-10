import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Trial } from '@/entities/trial.entity';
import { CreateTrialDto } from './dtos/create-trial.dto';

@Injectable()
export class TrialsService {
  constructor(
    @InjectRepository(Trial)
    private readonly trialRepository: Repository<Trial>,
  ) {}

  async findAll(): Promise<Trial[]> {
    return this.trialRepository.find({ relations: ['account'] });
  }

  async findOne(id: number): Promise<Trial> {
    const trial = await this.trialRepository.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!trial) {
      throw new NotFoundException(`Trial with id ${id} not found`);
    }
    return trial;
  }

  async create(data: CreateTrialDto, manager?: EntityManager): Promise<Trial> {
    const trialRepository = manager ? manager.getRepository(Trial) : this.trialRepository;
    const trial = trialRepository.create(data);
    return trialRepository.save(trial);
  }

  async update(id: number, data: Partial<Trial>): Promise<Trial> {
    const trial = await this.findOne(id);
    Object.assign(trial, data);
    return this.trialRepository.save(trial);
  }

  async remove(id: number): Promise<void> {
    const trial = await this.findOne(id);
    await this.trialRepository.remove(trial);
  }
}
