import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from '@/entities/subscription.entity';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.subscriptionsService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Subscription>) {
    return this.subscriptionsService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Subscription>) {
    return this.subscriptionsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.subscriptionsService.remove(+id);
  }
}
