// src/user-meta/user-meta.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserMetasService } from './user-metas.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@/entities/user.entity';

@Controller('user-metas')
export class UserMetasController {
  constructor(private readonly userMetaService: UserMetasService) {}

  // Exemplo de endpoint para registrar um metadado (provavelmente usado por admins ou fluxos específicos)
  // No caso de cadastro, a aceitação de termos é melhor gerenciada pelo AuthService.
  /*
  @Post()
  @UseGuards(JwtAuthGuard) // Protege o endpoint: requer autenticação JWT
  async create(@Body() createUserMetaDto: CreateUserMetaDto, @Req() req: Request) {
    // req.user contém o usuário autenticado (se o JwtAuthGuard configurar isso)
    const userId = (req.user as any).id; // Adapte de acordo com como seu req.user está tipado
    const { key, value, description } = createUserMetaDto;
    return this.userMetaService.recordUserAcceptance(userId, key, value, description || null);
  }
  */

  @Get('my-user-metas')
  @UseGuards(JwtAuthGuard)
  async getMyUserMetas(@Req() req: Request) {
    const userId = (req.user as User).id;
    return this.userMetaService.findAllUserMetas(userId);
  }

  @Get('my-user-metas/:key')
  @UseGuards(JwtAuthGuard)
  async getMyUserMetaByKey(@Param('key') key: string, @Req() req: Request) {
    const userId = (req.user as User).id;
    return this.userMetaService.findLatestUserMeta(userId, key);
  }

  // Você pode adicionar endpoints para administradores buscarem metadados de qualquer usuário
  /*
  @Get(':userId')
  @UseGuards(JwtAuthGuard) // Adicione um RoleGuard se for para admins
  async getUserMetas(@Param('userId') userId: number) {
    return this.userMetaService.findAllUserMeta(userId);
  }
  */
}
