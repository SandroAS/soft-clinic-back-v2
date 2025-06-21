import { Injectable, NotFoundException, ConflictException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import { User } from 'src/entities/user.entity';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { CompanyResponseDto } from './dtos/company-response.dto';
import { AddressesService } from '../addresses/addresses.service';


@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private readonly addressesService: AddressesService,
  ) {}

  /**
   * Cria uma nova empresa associada a um usuário.
   * @param createCompanyDto DTO com os dados da empresa.
   * @param user O objeto User completo que está criando a empresa.
   * @returns A empresa criada em formato de CompanyResponseDto.
   */
  async create(createCompanyDto: CreateCompanyDto, user: User): Promise<CompanyResponseDto> {
    const existingCompanyByCnpj = await this.companyRepository.findOne({ where: { cnpj: createCompanyDto.cnpj } });
    if (existingCompanyByCnpj) {
      this.logger.warn(`Tentativa de criar empresa com CNPJ já existente: ${createCompanyDto.cnpj}`);
      throw new ConflictException('Já existe uma empresa cadastrada com este CNPJ.');
    }
    // PARA ASSISTANT depois fazer a logica de dar opcao de usar mesma empresa da conta do ADMIN se existir

    const company = this.companyRepository.create({
      ...createCompanyDto,
      user,
      user_id: user.id,
    });

    try {
      const savedCompany = await this.companyRepository.save(company);
      return new CompanyResponseDto(savedCompany);
    } catch (err) {
      this.logger.error(`Erro ao tentar criar empresa: ${err.message}`, err.stack);
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
   * @param user O objeto User completo que está atualizando a empresa.
   * @returns A empresa atualizada em formato de CompanyResponseDto.
   * @throws NotFoundException se a empresa não for encontrada.
   * @throws ConflictException se o CNPJ ou email atualizados já existirem em outra empresa.
   */
  async update(uuid: string, updateCompanyDto: UpdateCompanyDto, user: User): Promise<CompanyResponseDto> {
    const company = await this.companyRepository.findOne({ where: { uuid }, relations: ['address'] })
    if (!company) {
      this.logger.warn(`Tentativa de atualizar empresa não existente com UUID: ${uuid}`);
      throw new NotFoundException(`Empresa com UUID '${uuid}' não encontrada.`);
    }

    if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
      const existingCompany = await this.companyRepository.findOne({ where: { cnpj: updateCompanyDto.cnpj } });
      if (existingCompany && existingCompany.uuid !== uuid) {
        this.logger.warn(`Tentativa de atualizar empresa com CNPJ já existente, CNPJ: ${updateCompanyDto.cnpj}`);
        throw new ConflictException('CNPJ já cadastrado para outra empresa.');
      }
    }

    if (updateCompanyDto.address !== undefined) {
      if (updateCompanyDto.address === null) {
        if (company.address) {
          company.address = null;
          await this.addressesService.remove(company.address.uuid);
        }
      } else if (company.address) {
        Object.assign(company.address, updateCompanyDto.address);
      } else {
        company.address = await this.addressesService.create(updateCompanyDto.address);
      }
    }

    const { address, ...restOfUpdateCompanyDto } = updateCompanyDto;
    Object.assign(company, restOfUpdateCompanyDto);

    try {
      const updatedCompany = await this.companyRepository.save(company);
      return new CompanyResponseDto(updatedCompany);
    } catch (err) {
      this.logger.error(`Error ao tentar atualizar empresa ${uuid}: ${err.message}`, err.stack);
      throw new InternalServerErrorException('Ocorreu um erro ao atualizar a empresa e/ou seu endereço.');
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
      this.logger.warn(`Tentativa de remover uma empresa não existente, UUID: ${uuid}`);
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
