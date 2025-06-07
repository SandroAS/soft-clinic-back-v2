import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SubscriptionChargesService } from './subscription-charges.service';
import { SubscriptionCharge } from '@/entities/subscription-charge.entity';

@Controller('subscription-charges')
export class SubscriptionChargesController {
  constructor(private readonly chargesService: SubscriptionChargesService) {}

  @Get()
  findAll() {
    return this.chargesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.chargesService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<SubscriptionCharge>) {
    return this.chargesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<SubscriptionCharge>) {
    return this.chargesService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.chargesService.remove(+id);
  }
}
