import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request, Put, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@/entities/user.entity';
import { CreateAccountUserDto } from './dtos/create-account-user.dto';
import { UpdateAccountUserDto } from './dtos/update-account-user-dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';

@Controller('account')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('users')
  @UseGuards(JwtAuthGuard)
  createAccountUser(@Body() data: CreateAccountUserDto, @Request() req) {
    const user: User = req.user;
    return this.accountsService.createAccountUser(data, user);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  findAllAccountUsers(@Request() req, @Query() pagination: PaginationDto) {
    const user: User = req.user as User;
    return this.accountsService.findAllAccountUsersWithPagination(user, pagination);
  }

  @Put('users/:uuid')
  @UseGuards(JwtAuthGuard)
  updateAccountUser(@Param('uuid') uuid: string, @Body() data: UpdateAccountUserDto, @Request() req) {
    const user: User = req.user;
    return this.accountsService.updateAccountUser(uuid, data, user);
  }

  @Patch('users/is-active/:uuid')
  @UseGuards(JwtAuthGuard)
  updateAccountUserIsActive(@Param('uuid') uuid: string) {
    return this.accountsService.updateAccountUserIsActive(uuid);
  }

  // @Post()
  // create(@Body() data: CreateAccountDto) {
  //   return this.accountsService.create(data);
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
