import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriptions1748797929811 implements MigrationInterface {
    name = 'CreateSubscriptions1748797929811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`subscriptions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`account_id\` int NOT NULL, \`plan_id\` int NOT NULL, \`started_at\` datetime NOT NULL, \`ended_at\` datetime NULL, \`cancelled\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING') NOT NULL DEFAULT 'PENDING', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_eb660c4a66c2c5d34455340100\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_e45fca5d912c3a2fab512ac25dc\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_e45fca5d912c3a2fab512ac25dc\``);
        await queryRunner.query(`DROP INDEX \`IDX_eb660c4a66c2c5d34455340100\` ON \`subscriptions\``);
        await queryRunner.query(`DROP TABLE \`subscriptions\``);
    }

}
