import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSales1749301129634 implements MigrationInterface {
    name = 'CreateSales1749301129634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sales\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, \`account_id\` int NULL, \`plan_id\` int NULL, \`subscription_id\` int NULL, \`subscription_charge_id\` int NULL, \`transaction_id\` varchar(255) NULL, \`type\` enum ('subscription', 'one_time', 'service') NOT NULL, \`original_amount\` decimal(10,2) NOT NULL, \`discount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`gateway_fee\` decimal(10,2) NOT NULL DEFAULT '0.00', \`total\` decimal(10,2) NOT NULL, \`method\` enum ('CREDIT_CARD', 'BOLETO', 'PIX') NOT NULL, \`installments\` int NOT NULL DEFAULT '1', \`gateway\` enum ('PAGARME') NOT NULL, \`status\` enum ('paid', 'waiting_refund', 'refunded', 'chargeback') NOT NULL DEFAULT 'paid', \`paid_at\` timestamp NULL, \`failed_reason\` text NULL, \`refund_solicitation_id\` int NULL, \`refund_solicitation_at\` timestamp NULL, \`refunded_at\` timestamp NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_5d754ffb5c2fd332a29a7e1e28\` (\`uuid\`), UNIQUE INDEX \`REL_0577a7c6e20aad84c6bd058f23\` (\`subscription_charge_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`subscription_charges\` ADD UNIQUE INDEX \`IDX_2b3598da2ac53d3ebb14b32958\` (\`sale_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_2b3598da2ac53d3ebb14b32958\` ON \`subscription_charges\` (\`sale_id\`)`);
        await queryRunner.query(`ALTER TABLE \`subscription_charges\` ADD CONSTRAINT \`FK_2b3598da2ac53d3ebb14b329587\` FOREIGN KEY (\`sale_id\`) REFERENCES \`sales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_5f282f3656814ec9ca2675aef6f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_a9fff44b228330b55dd34f0af1d\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_bd1fdc4cc43e70189aa406768d7\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_74f20ae3f823f517ae0fc459083\` FOREIGN KEY (\`subscription_id\`) REFERENCES \`subscriptions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_0577a7c6e20aad84c6bd058f23c\` FOREIGN KEY (\`subscription_charge_id\`) REFERENCES \`subscription_charges\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_0577a7c6e20aad84c6bd058f23c\``);
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_74f20ae3f823f517ae0fc459083\``);
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_bd1fdc4cc43e70189aa406768d7\``);
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_a9fff44b228330b55dd34f0af1d\``);
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_5f282f3656814ec9ca2675aef6f\``);
        await queryRunner.query(`ALTER TABLE \`subscription_charges\` DROP FOREIGN KEY \`FK_2b3598da2ac53d3ebb14b329587\``);
        await queryRunner.query(`DROP INDEX \`REL_2b3598da2ac53d3ebb14b32958\` ON \`subscription_charges\``);
        await queryRunner.query(`ALTER TABLE \`subscription_charges\` DROP INDEX \`IDX_2b3598da2ac53d3ebb14b32958\``);
        await queryRunner.query(`DROP INDEX \`REL_0577a7c6e20aad84c6bd058f23\` ON \`sales\``);
        await queryRunner.query(`DROP INDEX \`IDX_5d754ffb5c2fd332a29a7e1e28\` ON \`sales\``);
        await queryRunner.query(`DROP TABLE \`sales\``);
    }

}
