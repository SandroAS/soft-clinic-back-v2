import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TrialsService } from './trials.service';
import { Trial } from '@/entities/trial.entity';
import { CreateTrialDto } from './dtos/create-trial.dto';

@Controller('trials')
export class TrialsController {
  constructor(private readonly trialsService: TrialsService) {}

  @Get()
  findAll() {
    return this.trialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.trialsService.findOne(+id);
  }

  @Post()
  create(@Body() data: CreateTrialDto) {
    return this.trialsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Trial>) {
    return this.trialsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.trialsService.remove(+id);
  }
}
