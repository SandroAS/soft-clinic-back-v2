import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccounts1748796641425 implements MigrationInterface {
    name = 'CreateAccounts1748796641425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`admin_id\` int NOT NULL, \`plan_id\` int NULL, \`current_subscription_id\` int NULL, \`last_trial_id\` int NULL, \`in_trial\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_45705ce5c594e0b9f6158a4337\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_ec3913403cfe3d432d10a6b86fb\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_ec3913403cfe3d432d10a6b86fb\``);
        await queryRunner.query(`DROP INDEX \`IDX_45705ce5c594e0b9f6158a4337\` ON \`accounts\``);
        await queryRunner.query(`DROP TABLE \`accounts\``);
    }

}
