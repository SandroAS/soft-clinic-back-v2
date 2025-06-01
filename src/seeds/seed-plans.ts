import AppDataSource from '../../data-source';
import { Plan } from '../entities/plan.entity';

async function seedPlans() {
  await AppDataSource.initialize();

  const plans = [
    {
      name: 'Essencial Mensal',
      description: '1 administrador + até 3 assistentes. Ideal para clínicas iniciantes.',
      base_price: 200.00,
      interval: 'monthly',
    },
    {
      name: 'Essencial Anual',
      description: '1 administrador + até 3 assistentes. Versão anual com desconto.',
      price: 2000.00,
      interval: 'yearly',
    },
    {
      name: 'Profissional Mensal',
      description: '1 administrador + equipe de profissionais e assistentes. Ideal para clínicas em crescimento.',
      price: 200.00,
      price_per_professional: 150.00,
      interval: 'monthly',
    },
    {
      name: 'Profissional Anual',
      description: 'Plano completo anual com suporte para múltiplos profissionais.',
      price: 2000.00,
      price_per_professional: 1500.00,
      interval: 'yearly',
    },
  ] as const;

  const planRepo = AppDataSource.getRepository(Plan);

  for (const planData of plans) {
    const exists = await planRepo.findOneBy({ name: planData.name });
    if (!exists) {
      const plan = planRepo.create(planData);
      await planRepo.save(plan);
    }
  }

  console.log('✅ Planos inseridos com sucesso!');
  await AppDataSource.destroy();
}

seedPlans().catch((err) => {
  console.error('❌ Erro ao executar seed:', err);
});
