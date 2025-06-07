import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PaymentIntentionsService } from './payment-intentions.service';
import { PaymentIntention } from '@/entities/payment-intention.entity';

@Controller('payment-intentions')
export class PaymentIntentionsController {
  constructor(private readonly service: PaymentIntentionsService) {}

  @Get()
  async findAll(): Promise<PaymentIntention[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PaymentIntention> {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() data: Partial<PaymentIntention>): Promise<PaymentIntention> {
    return this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<PaymentIntention>,
  ): Promise<PaymentIntention> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id);
  }
}
