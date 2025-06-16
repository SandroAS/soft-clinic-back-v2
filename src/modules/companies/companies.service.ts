import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import { User } from 'src/entities/user.entity';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { CompanyResponseDto } from './dtos/company-response.dto';


@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  /**
   * Cria uma nova empresa associada a um usuário.
   * @param createCompanyDto DTO com os dados da empresa.
   * @param user O objeto User completo que está criando a empresa.
   * @returns A empresa criada em formato de CompanyResponseDto.
   */
  async create(createCompanyDto: CreateCompanyDto, user: User): Promise<CompanyResponseDto> {
    // 1. Validação de unicidade antes de criar
    const existingCompanyByCnpj = await this.companyRepository.findOne({ where: { cnpj: createCompanyDto.cnpj } });
    if (existingCompanyByCnpj) {
      this.logger.warn(`Attempted to create company with existing CNPJ: ${createCompanyDto.cnpj}`);
      throw new ConflictException('Já existe uma empresa cadastrada com este CNPJ.');
    }

    const existingCompanyByEmail = await this.companyRepository.findOne({ where: { email: createCompanyDto.email } });
    if (existingCompanyByEmail) {
      this.logger.warn(`Attempted to create company with existing email: ${createCompanyDto.email}`);
      throw new ConflictException('Já existe uma empresa cadastrada com este email.');
    }

    // 2. Cria a instância da empresa
    const company = this.companyRepository.create({
      ...createCompanyDto,
      user: user,
      user_id: user.id,
    });

    // 3. Salva a empresa no banco de dados
    try {
      const savedCompany = await this.companyRepository.save(company);
      this.logger.log(`Company '${savedCompany.name}' (UUID: ${savedCompany.uuid}) created by user ${user.id}.`);
      return new CompanyResponseDto(savedCompany);
    } catch (error) {
      this.logger.error(`Error creating company: ${error.message}`, error.stack);
      // Lança uma exceção genérica se for um erro inesperado
      throw new InternalServerErrorException('Ocorreu um erro ao criar a empresa.');
    }
  }

  /**
   * Encontra uma empresa pelo seu UUID.
   * @param uuid UUID da empresa.
   * @param relations Relações a serem carregadas (ex: ['user']).
   * @returns A empresa encontrada em formato de CompanyResponseDto.
   * @throws NotFoundException se a empresa não for encontrada.
   */
  async findOneByUuid(uuid: string, relations?: string[]): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({
      where: { uuid },
      relations: relations || [],
    });

    if (!company) {
      this.logger.warn(`Company with UUID '${uuid}' not found.`);
      throw new NotFoundException(`Empresa com UUID '${uuid}' não encontrada.`);
    }
    return new CompanyResponseDto(company);
  }

  /**
   * Encontra todas as empresas.
   * Em um cenário real, você adicionaria paginação, filtros e ordenação aqui.
   * @returns Uma lista de empresas em formato de CompanyResponseDto.
   */
  async findAll(): Promise<CompanyResponseDto[]> {
    const companies = await this.companyRepository.find(); // Pode adicionar { relations: ['user'] } se precisar
    return companies.map(company => new CompanyResponseDto(company));
  }

  /**
   * Atualiza os dados de uma empresa pelo seu UUID.
   * @param uuid UUID da empresa a ser atualizada.
   * @param updateCompanyDto DTO com os dados de atualização.
   * @returns A empresa atualizada em formato de CompanyResponseDto.
   * @throws NotFoundException se a empresa não for encontrada.
   * @throws ConflictException se o CNPJ ou email atualizados já existirem em outra empresa.
   */
  async update(uuid: string, updateCompanyDto: UpdateCompanyDto): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({ where: { uuid } });

    if (!company) {
      this.logger.warn(`Attempted to update non-existent company with UUID: ${uuid}`);
      throw new NotFoundException(`Empresa com UUID '${uuid}' não encontrada.`);
    }

    // Validação de unicidade para CNPJ e email se estiverem sendo atualizados
    if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
      const existingCompany = await this.companyRepository.findOne({ where: { cnpj: updateCompanyDto.cnpj } });
      if (existingCompany && existingCompany.uuid !== uuid) { // Garante que não é a própria empresa
        this.logger.warn(`Attempted to update company with existing CNPJ: ${updateCompanyDto.cnpj}`);
        throw new ConflictException('CNPJ já cadastrado para outra empresa.');
      }
    }
    if (updateCompanyDto.email && updateCompanyDto.email !== company.email) {
      const existingCompany = await this.companyRepository.findOne({ where: { email: updateCompanyDto.email } });
      if (existingCompany && existingCompany.uuid !== uuid) { // Garante que não é a própria empresa
        this.logger.warn(`Attempted to update company with existing email: ${updateCompanyDto.email}`);
        throw new ConflictException('Email já cadastrado para outra empresa.');
      }
    }

    // Aplica as atualizações e salva
    Object.assign(company, updateCompanyDto);
    try {
      const updatedCompany = await this.companyRepository.save(company);
      this.logger.log(`Company '${updatedCompany.name}' (UUID: ${uuid}) updated successfully.`);
      return new CompanyResponseDto(updatedCompany);
    } catch (error) {
      this.logger.error(`Error updating company ${uuid}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Ocorreu um erro ao atualizar a empresa.');
    }
  }

  /**
   * Remove uma empresa pelo seu UUID.
   * @param uuid UUID da empresa a ser removida.
   * @throws NotFoundException se a empresa não for encontrada.
   */
  async remove(uuid: string): Promise<void> {
    const result = await this.companyRepository.delete({ uuid });

    if (result.affected === 0) {
      this.logger.warn(`Attempted to remove non-existent company with UUID: ${uuid}`);
      throw new NotFoundException(`Empresa com UUID '${uuid}' não encontrada para remoção.`);
    }
    this.logger.log(`Company with UUID ${uuid} removed successfully.`);
  }

  /**
   * Verifica se um usuário é proprietário de uma empresa específica.
   * Usado para autorização baseada em recursos.
   * @param companyUuid UUID da empresa.
   * @param userId ID do usuário.
   * @returns True se o usuário for o proprietário, False caso contrário.
   */
  async isCompanyOwner(companyUuid: string, userId: number): Promise<boolean> {
    const company = await this.companyRepository.findOne({
      where: { uuid: companyUuid, user_id: userId },
    });
    return !!company;
  }
}
