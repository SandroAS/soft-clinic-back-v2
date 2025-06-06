import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1748797027265 implements MigrationInterface {
    name = 'CreateUsers1748797027265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`name\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`cellphone\` varchar(255) NULL, \`cpf\` varchar(255) NULL, \`gender\` enum ('MALE', 'FEMALE') NULL, \`password\` varchar(255) NOT NULL, \`account_id\` int NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_a95e949168be7b7ece1a2382fe\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_a95e949168be7b7ece1a2382fe\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
