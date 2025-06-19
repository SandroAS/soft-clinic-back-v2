import { Controller, Post, Body, Get, Param, Patch, Delete, HttpStatus, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { AddressAuthResponseDto } from './dtos/address-auth-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAddressDto: CreateAddressDto): Promise<AddressAuthResponseDto> {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  async findAll(): Promise<AddressAuthResponseDto[]> {
    return this.addressService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string, @Request() req,): Promise<AddressAuthResponseDto> {
    const user: User = req.user;
    return this.addressService.findOneByUuid(uuid);
  }

  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<AddressAuthResponseDto> {
    return this.addressService.update(uuid, updateAddressDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('uuid') uuid: string): Promise<void> {
    await this.addressService.remove(uuid);
  }
}
