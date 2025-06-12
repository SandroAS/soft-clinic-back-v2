import { SystemModuleName } from '@/entities/system-module.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateSystemModuleDto {
  @IsEnum(SystemModuleName, { message: 'O nome do módulo deve ser um valor válido do enum.' })
  @IsNotEmpty({ message: 'O nome do módulo é obrigatório.' })
  name: SystemModuleName;
}
