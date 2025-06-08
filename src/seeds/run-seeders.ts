import { seedPermissionsRoles } from './seed-permissions-roles';
import { seedPlans } from './seed-plans';

export async function runSeeders() {
  console.log('Running seeders...');
  await seedPermissionsRoles();
  await seedPlans();
  console.log('Seeders finished.');
}
