import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompany1750026932984 implements MigrationInterface {
    name = 'CreateCompany1750026932984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`companies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, \`name\` varchar(255) NULL, \`social_reason\` varchar(255) NULL, \`cnpj\` varchar(255) NULL, \`cellphone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_535ddf773996ede3697d07ef71\` (\`uuid\`), UNIQUE INDEX \`IDX_703760d095b8e399e34950f496\` (\`cnpj\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_703760d095b8e399e34950f496\` ON \`companies\``);
        await queryRunner.query(`DROP INDEX \`IDX_535ddf773996ede3697d07ef71\` ON \`companies\``);
        await queryRunner.query(`DROP TABLE \`companies\``);
    }

}
