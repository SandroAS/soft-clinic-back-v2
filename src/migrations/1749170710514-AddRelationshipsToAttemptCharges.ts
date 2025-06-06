import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipsToAttemptCharges1749170710514 implements MigrationInterface {
    name = 'AddRelationshipsToAttemptCharges1749170710514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD \`total_attempts\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`attempt_charges\` ADD CONSTRAINT \`FK_93c0d0e8b4a4fd3b0231f76aa6f\` FOREIGN KEY (\`payment_intention_id\`) REFERENCES \`payment_intentions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`attempt_charges\` DROP FOREIGN KEY \`FK_93c0d0e8b4a4fd3b0231f76aa6f\``);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP COLUMN \`total_attempts\``);
    }

}
