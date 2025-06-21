import { RolesTypes } from '@/modules/roles/dtos/roles-types.dto';
import AppDataSource from '../data-source';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';

const allPermissions = [
  'dashboard_read',
  'dashboard_billings_total_read',
  'dashboard_billings_chart_read',
  'subscription_settings_read',
  'subscription_settings_pay',
  'subscriptions_settings_cancel',
  'subscriptions_settings_upgrade',
  'integrations_settings_read',
  'integrations_settings_update',
  'integrations_settings_create',
  'integrations_settings_delete',
  'users_settings_read',
  'users_settings_update',
  'users_settings_deactive',
  'users_settings_create',
  'permissions_settings_read',
  'permissions_settings_create',
  'permissions_settings_update',
  'permissions_settings_delete',
  'services_settings_read',
  'services_settings_create',
  'services_settings_update',
  'services_settings_delete',
  'odontograma_categories_settings_read',
  'odontograma_categories_settings_create',
  'odontograma_categories_settings_update',
  'odontograma_categories_settings_delete',
  'patients_read',
  'patients_create',
  'patients_update',
  'patients_delete',
  'patients_record_read',
  'patients_record_profile_read',
  'patients_record_profile_update',
  'patients_record_anamnesis_read',
  'patients_record_anamnesis_update',
  'patients_record_odontograma_read',
  'patients_record_odontograma_create',
  'patients_record_odontograma_update',
  'patients_record_odontograma_delete',
  'patients_record_recipes_read',
  'patients_record_recipes_create',
  'patients_record_recipes_update',
  'patients_record_recipes_delete',
  'patients_record_attests_read',
  'patients_record_attests_create',
  'patients_record_attests_update',
  'patients_record_attests_delete',
  'patients_record_contracts_read',
  'patients_record_contracts_create',
  'patients_record_contracts_update',
  'patients_record_contracts_delete',
  'patients_record_files_read',
  'patients_record_files_create',
  'patients_record_files_update',
  'patients_record_files_delete',
  'budgets_read',
  'budgets_create',
  'budgets_update_status',
  'budgets_update',
  'budgets_view',
  'budgets_send_whatsapp',
  'budgets_schedule',
  'budgets_start_appointment',
  'appointments_read',
  'appointments_create',
  'appointments_update',
  'appointments_delete',
  'schedules_read',
  'schedules_create',
  'schedules_update',
  'schedules_delete',
  'models_read',
  'recipes_models_read',
  'recipes_models_create',
  'recipes_models_update',
  'recipes_models_delete',
  'attests_models_read',
  'attests_models_create',
  'attests_models_update',
  'attests_models_delete',
  'contracts_models_read',
  'contracts_models_create',
  'contracts_models_update',
  'contracts_models_delete',
];

// permissões restritas por role
const restrictedByAssistant = [
  'users_settings_read',
  'users_settings_update',
  'users_settings_create',
  'users_settings_deactive',
  'permissions_settings_read',
  'permissions_settings_create',
  'permissions_settings_update',
  'permissions_settings_delete',
  'subscriptions_settings_cancel',
  'subscriptions_settings_upgrade',
  'patients_record_recipes_create',
  'patients_record_recipes_update',
  'patients_record_recipes_delete',
  'patients_record_attests_create',
  'patients_record_attests_update',
  'patients_record_attests_delete',
  'appointments_create',
  'appointments_update',
  'appointments_delete',
];

const restrictedByProfessional = [
  'users_settings_read',
  'users_settings_update',
  'users_settings_create',
  'users_settings_deactive',
  'permissions_settings_read',
  'permissions_settings_create',
  'permissions_settings_update',
  'permissions_settings_delete',
  'subscriptions_settings_cancel',
  'subscriptions_settings_upgrade',
];

export async function seedPermissionsRoles() {
  const permissionRepo = AppDataSource.getRepository(Permission);
  const roleRepo = AppDataSource.getRepository(Role);

  // Cria role SUPER_ADMIN sem permissões vinculadas
  let superAdminRole = await roleRepo.findOne({ where: { name: RolesTypes.SUPER_ADMIN } });
  if (!superAdminRole) {
    superAdminRole = roleRepo.create({ name: RolesTypes.SUPER_ADMIN });
    await roleRepo.save(superAdminRole);
    console.log('✅ Role SUPER_ADMIN criada (sem permissões vinculadas).');
  } else {
    console.log('✅ Role SUPER_ADMIN já existe.');
  }

  // Cria as permissões
  const permissionEntities = await Promise.all(
    allPermissions.map(async (name) => {
      let existing = await permissionRepo.findOne({ where: { name } });
      if (!existing) {
        existing = permissionRepo.create({ name });
        await permissionRepo.save(existing);
      }
      return existing;
    })
  );
  console.log(`✅ ${permissionEntities.length} permissões criadas ou encontradas.`);

  // Cria role ADMIN com todas as permissões
  let adminRole = await roleRepo.findOne({ where: { name: RolesTypes.ADMIN } });
  if (!adminRole) {
    adminRole = roleRepo.create({
      name: RolesTypes.ADMIN,
      permissions: permissionEntities,
    });
    await roleRepo.save(adminRole);
    console.log('✅ Role ADMIN criada.');
  } else {
    console.log('✅ Role ADMIN já existe.');
  }

  // Criar role ASSISTANT com permissões restritas para assistentes
  let assistantRole = await roleRepo.findOne({ where: { name: RolesTypes.ASSISTANT } });
  if (!assistantRole) {
    const assistantPermissions = permissionEntities.filter(
      (p) => !restrictedByAssistant.includes(p.name)
    );
    assistantRole = roleRepo.create({
      name: RolesTypes.ASSISTANT,
      permissions: assistantPermissions,
    });
    await roleRepo.save(assistantRole);
    console.log('✅ Role ASSISTANT criada.');
  } else {
    console.log('✅ Role ASSISTANT já existe.');
  }

  // Criar role HEALTHCARE_PROFESSIONAL com permissões restritas para profissionais de saúde
  let professionalRole = await roleRepo.findOne({ where: { name: RolesTypes.HEALTHCARE_PROFESSIONAL } });
  if (!professionalRole) {
    const professionalPermissions = permissionEntities.filter(
      (p) => !restrictedByProfessional.includes(p.name)
    );
    professionalRole = roleRepo.create({
      name: RolesTypes.HEALTHCARE_PROFESSIONAL,
      permissions: professionalPermissions,
    });
    await roleRepo.save(professionalRole);
    console.log('✅ Role HEALTHCARE_PROFESSIONAL criada.');
  } else {
    console.log('✅ Role HEALTHCARE_PROFESSIONAL já existe.');
  }
}
