import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTrials1748798319722 implements MigrationInterface {
    name = 'CreateTrials1748798319722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_7e32a3b38f3fec3adf342b5b42\` ON \`accounts\``);
        await queryRunner.query(`CREATE TABLE \`trials\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`started_at\` datetime NOT NULL, \`ended_at\` datetime NULL, \`account_id\` int NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_35b28eced13b5eafe3e0f85d63\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_35b28eced13b5eafe3e0f85d63\` ON \`trials\``);
        await queryRunner.query(`DROP TABLE \`trials\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_7e32a3b38f3fec3adf342b5b42\` ON \`accounts\` (\`current_subscription_id\`)`);
    }

}
