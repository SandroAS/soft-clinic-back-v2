import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from 'src/entities/address.entity';
import { CreateAddressDto } from './dtos/create-address.dto';
import { UpdateAddressDto } from './dtos/update-address.dto';
import { AddressAuthResponseDto } from './dtos/address-auth-response.dto'

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  /**
   * Cria um novo endereço.
   * @param createAddressDto DTO com os dados do endereço.
   * @returns 
   */
  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create(createAddressDto);

    try {
      const savedAddress = await this.addressRepository.save(address);
      return savedAddress;
    } catch (error) {
      this.logger.error(`Erro ao tentar criar enderesso: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Ocorreu um erro ao criar o endereço.');
    }
  }

  /**
   * Encontra um endereço pelo seu UUID.
   * @param uuid UUID do endereço.
   * @returns O endereço encontrado em formato de AddressAuthResponseDto.
   * @throws NotFoundException se o endereço não for encontrado.
   */
  async findOneByUuid(uuid: string): Promise<AddressAuthResponseDto> {
    const address = await this.addressRepository.findOne({ where: { uuid } });

    if (!address) {
      this.logger.warn(`Endereço com UUID '${uuid}' não encontrado.`);
      throw new NotFoundException(`Endereço com UUID '${uuid}' não encontrado.`);
    }

    return new AddressAuthResponseDto(address);
  }

  /**
   * Encontra todos os endereços.
   * Em um cenário real, adicione paginação, filtros e ordenação.
   * @returns Uma lista de endereços em formato de AddressAuthResponseDto.
   */
  async findAll(): Promise<AddressAuthResponseDto[]> {
    const addresses = await this.addressRepository.find();
    return addresses.map(address => new AddressAuthResponseDto(address));
  }

  /**
   * Atualiza os dados de um endereço pelo seu UUID.
   * @param uuid UUID do endereço a ser atualizado.
   * @param updateAddressDto DTO com os dados de atualização.
   * @returns O endereço atualizado em formato de AddressAuthResponseDto.
   * @throws NotFoundException se o endereço não for encontrado.
   */
  async update(uuid: string, updateAddressDto: UpdateAddressDto): Promise<AddressAuthResponseDto> {
    const address = await this.addressRepository.findOne({ where: { uuid } });

    if (!address) {
      this.logger.warn(`Tentativa de atualizar endereço que não existe, UUID: ${uuid}`);
      throw new NotFoundException(`Endereço com UUID '${uuid}' não encontrado.`);
    }

    Object.assign(address, updateAddressDto);
    try {
      const updatedAddress = await this.addressRepository.save(address);
      return new AddressAuthResponseDto(updatedAddress);
    } catch (error) {
      this.logger.error(`Erro ao tentar atualizar endereço ${uuid}: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Ocorreu um erro ao atualizar o endereço.');
    }
  }

  /**
   * Remove um endereço pelo seu UUID.
   * @param uuid UUID do endereço a ser removido.
   * @throws NotFoundException se o endereço não for encontrado.
   */
  async remove(uuid: string): Promise<void> {
    const result = await this.addressRepository.delete({ uuid });

    if (result.affected === 0) {
      this.logger.warn(`Tentativa de remover endereço não existente UUID: ${uuid}`);
      throw new NotFoundException(`Endereço com UUID '${uuid}' não encontrado para remoção.`);
    }
  }
}
