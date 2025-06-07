import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnTimestampUuidToPermissions1749310062843 implements MigrationInterface {
    name = 'AddColumnTimestampUuidToPermissions1749310062843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD \`uuid\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD UNIQUE INDEX \`IDX_82c4b329177eba3db6338f732c\` (\`uuid\`)`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP INDEX \`IDX_82c4b329177eba3db6338f732c\``);
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP COLUMN \`uuid\``);
    }

}
