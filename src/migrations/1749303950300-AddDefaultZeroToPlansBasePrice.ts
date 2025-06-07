import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultZeroToPlansBasePrice1749303950300 implements MigrationInterface {
    name = 'AddDefaultZeroToPlansBasePrice1749303950300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`plans\` CHANGE \`base_price\` \`base_price\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`plans\` CHANGE \`base_price\` \`base_price\` decimal(10,2) NOT NULL`);
    }

}
