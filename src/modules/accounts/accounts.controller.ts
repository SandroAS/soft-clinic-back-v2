import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';


@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  // @Post()
  // create(@Body() data: CreateAccountDto) {
  //   return this.accountsService.create(data);
  // }

  // @Get()
  // findAll() {
  //   return this.accountsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.accountsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() data: UpdateAccountDto) {
  //   return this.accountsService.update(+id, data);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.accountsService.remove(+id);
  // }
}
