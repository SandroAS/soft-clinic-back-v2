import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnPricePerProfessionalToPlans1748807122359 implements MigrationInterface {
    name = 'AddColumnPricePerProfessionalToPlans1748807122359'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_7f9954637355c3a36afffcc45c\` ON \`accounts\``);
        await queryRunner.query(`ALTER TABLE \`plans\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`plans\` ADD \`is_dynamic\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`plans\` ADD \`base_price\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`plans\` ADD \`price_per_professional\` decimal(10,2) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`plans\` DROP COLUMN \`price_per_professional\``);
        await queryRunner.query(`ALTER TABLE \`plans\` DROP COLUMN \`base_price\``);
        await queryRunner.query(`ALTER TABLE \`plans\` DROP COLUMN \`is_dynamic\``);
        await queryRunner.query(`ALTER TABLE \`plans\` ADD \`price\` decimal NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_7f9954637355c3a36afffcc45c\` ON \`accounts\` (\`last_trial_id\`)`);
    }

}
