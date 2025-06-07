import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PlansService } from './plans.service';
import { Plan } from '@/entities/plan.entity';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.plansService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Plan>) {
    return this.plansService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Plan>) {
    return this.plansService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.plansService.remove(+id);
  }
}
