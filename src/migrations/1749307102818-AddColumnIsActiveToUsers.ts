import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsActiveToUsers1749307102818 implements MigrationInterface {
    name = 'AddColumnIsActiveToUsers1749307102818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`is_active\` tinyint NOT NULL DEFAULT 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`is_active\``);
    }

}
