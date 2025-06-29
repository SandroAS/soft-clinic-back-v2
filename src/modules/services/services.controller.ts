import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { ServiceResponseDto } from './dtos/service-response.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResult } from '@/common/services/base.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import AuthenticatedRequest from '@/common/types/authenticated-request.type';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async create(@Body() createServiceDto: CreateServiceDto, @Request() req: AuthenticatedRequest): Promise<ServiceResponseDto> {
    const service = await this.servicesService.createServiceForAccount(createServiceDto, req.user.account_id);
    return new ServiceResponseDto(service);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto, @Request() req: AuthenticatedRequest): Promise<PaginationResult<ServiceResponseDto>> {
    const paginatedServices = await this.servicesService.findAllPaginatedByAccount(paginationDto, req.user.account_id);
    
    const mappedData = paginatedServices.data.map(service => new ServiceResponseDto(service));

    return {
      ...paginatedServices,
      data: mappedData,
    };
  }

  @Get(':uuid')
  async findByUuidAndModule(@Param('uuid') uuid: string, @Request() req: AuthenticatedRequest): Promise<ServiceResponseDto> {
    const service = await this.servicesService.findOneByUuidForAccount(uuid, req.user.account_id);
    return new ServiceResponseDto(service);
  }

  @Put(':uuid')
  async update(@Param('id') uuid: string, @Body() updateServiceDto: UpdateServiceDto, @Request() req: AuthenticatedRequest): Promise<ServiceResponseDto> {
    const service = await this.servicesService.updateForAccount(uuid, updateServiceDto, req.user.account_id);
    return new ServiceResponseDto(service);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('uuid') uuid: string, @Request() req: AuthenticatedRequest): Promise<void> {
    await this.servicesService.removeForAccount(uuid, req.user.account_id);
  }
}
