import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum BrazilianStates {
  AC = 'AC', // Acre
  AL = 'AL', // Alagoas
  AP = 'AP', // Amapá
  AM = 'AM', // Amazonas
  BA = 'BA', // Bahia
  CE = 'CE', // Ceará
  DF = 'DF', // Distrito Federal
  ES = 'ES', // Espírito Santo
  GO = 'GO', // Goiás
  MA = 'MA', // Maranhão
  MT = 'MT', // Mato Grosso
  MS = 'MS', // Mato Grosso do Sul
  MG = 'MG', // Minas Gerais
  PA = 'PA', // Pará
  PB = 'PB', // Paraíba
  PR = 'PR', // Paraná
  PE = 'PE', // Pernambuco
  PI = 'PI', // Piauí
  RJ = 'RJ', // Rio de Janeiro
  RN = 'RN', // Rio Grande do Norte
  RS = 'RS', // Rio Grande do Sul
  RO = 'RO', // Rondônia
  RR = 'RR', // Roraima
  SC = 'SC', // Santa Catarina
  SP = 'SP', // São Paulo
  SE = 'SE', // Sergipe
  TO = 'TO', // Tocantins
}

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 36, unique: true, nullable: false })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @Column({ type: 'varchar', length: 9, nullable: false })
  cep: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  street: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  complement: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  neighborhood: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  city: string;

  @Column({
    type: 'enum',
    enum: BrazilianStates,
    nullable: false,
  })
  state: BrazilianStates;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updated_at: Date;
}
