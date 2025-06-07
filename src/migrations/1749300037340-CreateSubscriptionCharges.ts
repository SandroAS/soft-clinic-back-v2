import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriptionCharges1749300037340 implements MigrationInterface {
    name = 'CreateSubscriptionCharges1749300037340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subscription_charges\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`subscription_id\` int NULL, \`sale_id\` int NULL, \`amount\` decimal(10,2) NOT NULL, \`status\` enum ('open', 'paid', 'failed') NOT NULL DEFAULT 'open', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_4bc6c7bf8b1f661abe58279a56\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD \`accountId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD \`sale_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD \`account_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD CONSTRAINT \`FK_32af80b57965bad06e5c589334c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD CONSTRAINT \`FK_6ff30f16d68f774ff8bc14463b2\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP FOREIGN KEY \`FK_6ff30f16d68f774ff8bc14463b2\``);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP FOREIGN KEY \`FK_32af80b57965bad06e5c589334c\``);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP COLUMN \`account_id\``);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP COLUMN \`sale_id\``);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP COLUMN \`accountId\``);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP COLUMN \`userId\``);
        await queryRunner.query(`DROP INDEX \`IDX_4bc6c7bf8b1f661abe58279a56\` ON \`subscription_charges\``);
        await queryRunner.query(`DROP TABLE \`subscription_charges\``);
    }

}
