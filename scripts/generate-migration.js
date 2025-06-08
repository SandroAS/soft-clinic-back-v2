import { execSync } from 'child_process';

const args = process.argv.slice(2);

if (!args[0]) {
  console.error('❌ Informe o nome da migration.\nEx: npm run migration:generate -- CreatePlan');
  process.exit(1);
}

const name = args[0];
const migrationPath = `src/migrations/${name}`;

execSync(
  `ts-node --esm ./node_modules/typeorm/cli.js migration:generate ${migrationPath} -d ./src/data-source.ts`,
  { stdio: 'inherit' }
);
