import AppDataSource from '../data-source';
import { SystemModule, SystemModuleName } from '../entities/system-module.entity';

export async function seedSystemModules() {
  const systemModules = [
    { name: SystemModuleName.DENTISTRY },
    { name: SystemModuleName.PSYCHOLOGY },
    { name: SystemModuleName.NUTRITION },
    { name: SystemModuleName.PHYSIOTHERAPY },
  ];

  const systemModuleRepo = AppDataSource.getRepository(SystemModule);

  for (const moduleData of systemModules) {

    const exists = await systemModuleRepo.findOneBy({ name: moduleData.name });

    if (!exists) {
      // Se não existe, cria e salva o novo módulo
      const module = systemModuleRepo.create(moduleData);
      await systemModuleRepo.save(module);
      console.log(`✅ Módulo de sistema "${moduleData.name}" inserido com sucesso.`);
    } else {
      console.log(`✅ Módulo de sistema "${moduleData.name}" já existe. Pulando inserção.`);
    }
  }
}
