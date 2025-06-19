import { Controller, Post, Body, Get, Param, Delete, UseGuards, Request, HttpStatus, HttpCode, Put } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { CompanyResponseDto } from './dtos/company-response.dto';
import { User } from 'src/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('company')
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Request() req,
  ): Promise<CompanyResponseDto> {
    const user: User = req.user;
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
    return company;
  }

  @Put(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Request() req,
  ): Promise<CompanyResponseDto> {
    const user: User = req.user;
    return this.companyService.update(uuid, updateCompanyDto, user);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('uuid') uuid: string,
    @Request() req,
  ): Promise<void> {
    const user: User = req.user;
    await this.companyService.remove(uuid);
  }
}
