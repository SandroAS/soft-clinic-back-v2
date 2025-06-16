import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Request, HttpStatus, HttpCode, NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { CompanyResponseDto } from './dtos/company-response.dto';
import { User } from 'src/entities/user.entity'; // Sua entidade User para tipagem

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Retorna status 201 Created
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Request() req, // O JwtAuthGuard anexa o objeto `user` autenticado aqui
  ): Promise<CompanyResponseDto> {
    const user: User = req.user; // Pega o usuário injetado pelo guard
    return this.companyService.create(createCompanyDto, user);
  }

  @Get()
  async findAll(): Promise<CompanyResponseDto[]> {
    return this.companyService.findAll();
  }

  @Get(':uuid')
  async findOne(
    @Param('uuid') uuid: string,
    @Request() req,
  ): Promise<CompanyResponseDto> {
    const user: User = req.user;
    const company = await this.companyService.findOneByUuid(uuid);

    // Lógica de autorização baseada em recurso:
    // Se o usuário não for ADMIN, ele só pode ver suas próprias empresas
    // if (user.role.name !== RolesTypes.ADMIN) {
    //   if (company.userId !== user.id) {
    //     throw new NotFoundException(`Empresa com UUID '${uuid}' não encontrada ou você não tem permissão para acessá-la.`);
    //   }
    // }
    return company;
  }

  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req,
  ): Promise<CompanyResponseDto> {
    const user: User = req.user;
    // Verifica permissão (ADMIN ou proprietário) antes de tentar atualizar
    // if (user.role.name !== RolesTypes.ADMIN) {
    //   const isOwner = await this.companyService.isCompanyOwner(uuid, user.id);
    //   if (!isOwner) {
    //     throw new NotFoundException(`Empresa com UUID '${uuid}' não encontrada ou você não tem permissão para atualizá-la.`);
    //   }
    // }
    return this.companyService.update(uuid, updateCompanyDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna status 204 No Content para remoção bem-sucedida
  async remove(
    @Param('uuid') uuid: string,
    @Request() req,
  ): Promise<void> {
    const user: User = req.user;
    // Verifica permissão (ADMIN ou proprietário) antes de tentar remover
    // if (user.role.name !== RolesTypes.ADMIN) {
    //   const isOwner = await this.companyService.isCompanyOwner(uuid, user.id);
    //   if (!isOwner) {
    //     throw new NotFoundException(`Empresa com UUID '${uuid}' não encontrada ou você não tem permissão para removê-la.`);
    //   }
    // }
    await this.companyService.remove(uuid);
  }
}
