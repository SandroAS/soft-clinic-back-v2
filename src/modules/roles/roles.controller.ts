import { Controller, Get, Param, Post, Body, UseGuards, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '@/common/dtos/pagination.dto';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.rolesService.findAllWithPaginationOptimized(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rolesService.findOne(id);
  }

  @Post(':id/permissions')
  assignPermissions(
    @Param('id') id: number,
    @Body('permissionIds') permissionIds: number[],
  ) {
    return this.rolesService.assignPermissions(id, permissionIds);
  }
}
