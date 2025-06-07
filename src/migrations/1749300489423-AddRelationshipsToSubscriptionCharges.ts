import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipsToSubscriptionCharges1749300489423 implements MigrationInterface {
    name = 'AddRelationshipsToSubscriptionCharges1749300489423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscription_charges\` ADD CONSTRAINT \`FK_c949b50558b897d6aa8085cb0c3\` FOREIGN KEY (\`subscription_id\`) REFERENCES \`subscriptions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscription_charges\` DROP FOREIGN KEY \`FK_c949b50558b897d6aa8085cb0c3\``);
    }

}
