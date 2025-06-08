import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AttemptChargesService } from './attempt-charges.service';
import { AttemptCharge } from '@/entities/attempt-charge.entity';

@Controller('attempt-charges')
export class AttemptChargesController {
  constructor(private readonly service: AttemptChargesService) {}

  @Get()
  findAll(): Promise<AttemptCharge[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<AttemptCharge> {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() data: Partial<AttemptCharge>): Promise<AttemptCharge> {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<AttemptCharge>): Promise<AttemptCharge> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id);
  }
}
