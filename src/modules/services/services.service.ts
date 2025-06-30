import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseService } from '@/common/services/base.service';
import { Service } from '@/entities/service.entity';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { SystemModulesService } from '../system-modules/system-modules.service';
import { SystemModuleName } from '@/entities/system-module.entity';

const DEFAULT_MODULE_SERVICES: { [key in SystemModuleName]?: { name: string; description: string; price: string }[] } = {
  [SystemModuleName.DENTISTRY]: [
    { name: 'Consulta Odontológica Inicial', description: 'Avaliação completa da saúde bucal e plano de tratamento.', price: '100.00' },
    { name: 'Limpeza Dental (Profilaxia)', description: 'Remoção de tártaro e placa bacteriana, polimento.', price: '120.00' },
    { name: 'Restauração em Resina Composta', description: 'Preenchimento de cáries com material estético.', price: '180.00' },
    { name: 'Extração Simples', description: 'Remoção de dente sem complicação cirúrgica.', price: '300.00' },
    { name: 'Clareamento Dental (Sessão)', description: 'Sessão de clareamento no consultório.', price: '200.00' },
    { name: 'Aplicação de Flúor', description: 'Fortalecimento do esmalte dental para prevenção de cáries.', price: '50.00' },
    { name: 'Radiografia Periapical', description: 'Exame radiográfico detalhado de um dente específico.', price: '80.00' },
    { name: 'Consulta de Urgência', description: 'Atendimento para dor ou emergência odontológica.', price: '120.00' },
    { name: 'Check-up Preventivo', description: 'Revisão periódica para manter a saúde bucal.', price: '90.00' },
    { name: 'Ortodontia - Manutenção Mensal', description: 'Acompanhamento e ajuste de aparelho ortodôntico.', price: '130.00' },
  ],
  [SystemModuleName.PSYCHOLOGY]: [
    { name: 'Sessão de Psicoterapia Individual', description: 'Atendimento psicológico focado em questões pessoais.', price: '250.00' },
    { name: 'Consulta de Aconselhamento Breve', description: 'Orientação focada em um problema específico em poucas sessões.', price: '180.00' },
    { name: 'Avaliação Psicológica', description: 'Aplicação de testes e entrevistas para diagnóstico.', price: '400.00' },
    { name: 'Terapia de Casal', description: 'Atendimento para resolução de conflitos e melhoria da relação.', price: '350.00' },
    { name: 'Orientação Profissional', description: 'Sessões para auxiliar na escolha ou transição de carreira.', price: '220.00' },
    { name: 'Sessão de Psicoterapia Infantil', description: 'Atendimento psicológico adaptado para crianças e adolescentes.', price: '260.00' },
    { name: 'Grupoterapia (Sessão)', description: 'Sessões terapêuticas em grupo com temas específicos.', price: '150.00' },
    { name: 'Plantão Psicológico', description: 'Atendimento emergencial para crises emocionais.', price: '200.00' },
    { name: 'Neuropsicologia - Sessão', description: 'Abordagem para problemas cognitivos e comportamentais.', price: '280.00' },
    { name: 'Sessão de Hipnoterapia', description: 'Terapia complementar utilizando técnicas de hipnose.', price: '320.00' },
  ],
  [SystemModuleName.NUTRITION]: [
    { name: 'Consulta Nutricional Inicial', description: 'Avaliação completa e plano alimentar personalizado.', price: '200.00' },
    { name: 'Retorno Nutricional', description: 'Acompanhamento e ajustes no plano alimentar.', price: '120.00' },
    { name: 'Plano Alimentar para Hipertrofia', description: 'Orientação nutricional para ganho de massa muscular.', price: '280.00' },
    { name: 'Plano Alimentar para Emagrecimento', description: 'Orientação nutricional focada na perda de peso saudável.', price: '280.00' },
    { name: 'Avaliação Composição Corporal', description: 'Medição e análise de massa gorda, massa magra, etc.', price: '80.00' },
    { name: 'Nutrição Esportiva - Consulta', description: 'Orientação para atletas e praticantes de atividade física.', price: '220.00' },
    { name: 'Nutrição Clínica - Diabetes', description: 'Manejo nutricional para pacientes diabéticos.', price: '210.00' },
    { name: 'Reeducação Alimentar - Pacote 5 sessões', description: 'Programa completo de mudança de hábitos alimentares.', price: '850.00' },
    { name: 'Consultoria Nutricional Online', description: 'Atendimento e suporte nutricional à distância.', price: '180.00' },
    { name: 'Nutrição Materno-Infantil', description: 'Orientação nutricional para gestantes e crianças.', price: '230.00' },
  ],
  [SystemModuleName.PHYSIOTHERAPY]: [
    { name: 'Avaliação Fisioterapêutica', description: 'Primeira consulta para diagnóstico e plano de tratamento.', price: '180.00' },
    { name: 'Sessão de Fisioterapia Convencional', description: 'Sessão de tratamento para reabilitação musculoesquelética.', price: '100.00' },
    { name: 'Fisioterapia Respiratória (Sessão)', description: 'Tratamento para disfunções respiratórias.', price: '130.00' },
    { name: 'Liberação Miofascial (Sessão)', description: 'Técnica para aliviar tensões musculares e dores.', price: '150.00' },
    { name: 'Sessão de RPG (Reeducação Postural Global)', description: 'Correção de desvios posturais e dores crônicas.', price: '200.00' },
    { name: 'Fisioterapia Neurológica (Sessão)', description: 'Reabilitação para pacientes com lesões neurológicas.', price: '170.00' },
    { name: 'Cinesioterapia (Sessão)', description: 'Terapia baseada em movimentos para recuperação da função.', price: '90.00' },
    { name: 'Reabilitação Pós-operatória', description: 'Fisioterapia após procedimentos cirúrgicos.', price: '140.00' },
    { name: 'Ventosaterapia (Sessão)', description: 'Técnica com ventosas para alívio de dores e tensões.', price: '110.00' },
    { name: 'Pilates Clínico (Sessão Individual)', description: 'Sessões de pilates adaptadas para condições específicas.', price: '160.00' },
  ],
};

@Injectable()
export class ServicesService extends BaseService<Service> {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly systemModulesService: SystemModulesService
  ) {
    super(serviceRepository);
  }

  async createServiceForAccount(createServiceDto: CreateServiceDto, accountId: number, manager?: EntityManager): Promise<Service> {
    const serviceRepository = manager ? manager.getRepository(Service) : this.serviceRepository;

    const systemModule = await this.systemModulesService.findOneByUuid(createServiceDto.system_module_uuid, manager);
    if (!systemModule) {
      throw new NotFoundException(`Módulo do Sistema de UUID: ${createServiceDto.system_module_uuid} não encontrado.`);
    }

    const existingService = await serviceRepository.findOne({
      where: { name: createServiceDto.name, account_id: accountId, system_module_id: systemModule.id },
    });
    if (existingService) {
      throw new BadRequestException('Já existe um serviço com este nome para este módulo e conta.');
    }

    const newService = serviceRepository.create({
      ...createServiceDto,
      price: Number(createServiceDto.price),
      account_id: accountId,
      system_module_id: systemModule.id,
      systemModule
    });

    return serviceRepository.save(newService);
  }

  async createDefaultServicesForNewAccount(selectedClinicType: SystemModuleName, accountId: number, manager?: EntityManager) {
    const systemModule = await this.systemModulesService.findByName(selectedClinicType, manager);
    if (!systemModule) {
      throw new BadRequestException(`Módulo do Sistema '${selectedClinicType}' não encontrado ao tentar criar seus respectivos Serviços padrão.`);
    }

    const defaultServices = DEFAULT_MODULE_SERVICES[systemModule.name];
    if (defaultServices && defaultServices.length > 0) {
      for (const serviceData of defaultServices) {
        await this.createServiceForAccount(
          { 
            name: serviceData.name, 
            description: serviceData.description, 
            price: Number(serviceData.price),
            system_module_uuid: systemModule.uuid
          }, 
          accountId, 
          manager
        );
      }
    }
  }

  async findAllPaginatedByAccount(pagination: PaginationDto, accountId: number) {
    const searchColumns = ['name', 'description'];
    
    const accountFilter = (qb: any) => {
      qb.andWhere('entity.account_id = :accountId', { accountId });
    };

    return this.findAndPaginate(pagination, searchColumns, accountFilter);
  }

  async findOneByUuidForAccount(uuid: string, accountId: number, relations?: string[]): Promise<Service> {
   return await this.serviceRepository.findOne({ where: { uuid, account_id: accountId }, relations });
  }

  async updateForAccount(uuid: string, updateServiceDto: UpdateServiceDto, accountId: number): Promise<Service> {
    const service = await this.findOneByUuidForAccount(uuid, accountId, ['systemModule']);
    if (!service) {
      throw new BadRequestException(`Serviço com UUID ${uuid} não encontrado para esta conta ao tentar atualizar.`);
    }

    let newSystemModuleId: number | undefined;
    if (updateServiceDto.system_module_uuid && updateServiceDto.system_module_uuid !== service.systemModule.uuid) {
      const systemModule = await this.systemModulesService.findOneByUuid(updateServiceDto.system_module_uuid);
      if (!systemModule) {
        throw new NotFoundException(`Novo Módulo do Sistema de UUID: ${updateServiceDto.system_module_uuid} não encontrado.`);
      }
      newSystemModuleId = systemModule.id;
    } else {
      newSystemModuleId = service.system_module_id; 
    }

    const nameChanged = updateServiceDto.name !== undefined && updateServiceDto.name !== service.name;
    const moduleChanged = newSystemModuleId !== service.system_module_id;

    if (nameChanged || moduleChanged) {
      const targetName = updateServiceDto.name !== undefined ? updateServiceDto.name : service.name;
      const targetSystemModuleId = newSystemModuleId !== undefined ? newSystemModuleId : service.system_module_id;

      const existingServiceWithSameNameAndModule = await this.serviceRepository.findOne({
        where: { 
          name: targetName,
          account_id: accountId,
          system_module_id: targetSystemModuleId
        },
      });

      if (existingServiceWithSameNameAndModule && existingServiceWithSameNameAndModule.uuid !== uuid) {
        throw new BadRequestException('Já existe outro serviço com este nome e módulo para esta conta.');
      }
    }

    Object.assign(service, updateServiceDto);
    if (newSystemModuleId !== undefined && newSystemModuleId !== service.system_module_id) {
      service.system_module_id = newSystemModuleId;
    }

    if (updateServiceDto.price !== undefined) {
      service.price = Number(updateServiceDto.price); 
    }

    return this.serviceRepository.save(service);
  }

  async removeForAccount(uuid: string, accountId: number): Promise<void> {
    const service = await this.serviceRepository.findOne({ where: { uuid, account_id: accountId } });
    if (!service) {
      throw new NotFoundException(`Serviço com UUID ${uuid} não encontrado para esta conta ao tentar deletar.`);
    }
    await this.serviceRepository.remove(service);
  }
}
