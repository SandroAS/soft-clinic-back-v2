import { seedPermissionsRoles } from './seed-permissions-roles';
import { seedPlans } from './seed-plans';
import { seedSystemModules } from './seed-system-modules';

export async function runSeeders() {
  console.log('Running seeders...');
  await seedPermissionsRoles();
  await seedPlans();
  await seedSystemModules();
  console.log('Seeders finished.');
}
