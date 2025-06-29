import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, NotFoundException } from '@nestjs/common';
import { SystemModulesService } from './system-modules.service';
import { CreateSystemModuleDto } from './dtos/create-system-module.dto';
import { UpdateSystemModuleDto } from './dtos/update-system-module.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Importe seu JwtAuthGuard
// import { RolesGuard } from '../auth/roles.guard'; // Se você tiver um RolesGuard
// import { Roles } from '../auth/roles.decorator'; // Se você tiver um decorador @Roles
// import { Role } from '../common/enums/role.enum'; // Se você tiver um enum de roles

@Controller('system-modules')
// @UseGuards(JwtAuthGuard, RolesGuard) // Protege o controlador com autenticação e roles
// @Roles(Role.Admin) // Exemplo: apenas admins podem gerenciar módulos
export class SystemModulesController {
  constructor(private readonly systemModuleService: SystemModulesService) {}

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async create(@Body() createSystemModuleDto: CreateSystemModuleDto) {
  //   return this.systemModuleService.create(createSystemModuleDto.name);
  // }

  @Get()
  async findAll() {
    return this.systemModuleService.findAll(['uuid', 'name']);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const module = await this.systemModuleService.findOneById(+id);
  //   if (!module) {
  //     // Use NotFoundException do NestJS para respostas 404
  //     throw new NotFoundException(`SystemModule with ID ${id} not found.`);
  //   }
  //   return module;
  // }

  // @Put(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateSystemModuleDto: UpdateSystemModuleDto,
  // ) {
  //   return this.systemModuleService.update(+id, updateSystemModuleDto.name);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content para deleção bem-sucedida
  // async remove(@Param('id') id: string) {
  //   const removed = await this.systemModuleService.remove(+id);
  //   if (!removed) {
  //     throw new NotFoundException(`SystemModule with ID ${id} not found.`);
  //   }
  //   // Não retorna nada no 204
  // }
}
