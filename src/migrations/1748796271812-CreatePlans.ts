import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlans1748796271812 implements MigrationInterface {
    name = 'CreatePlans1748796271812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`plans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`price\` decimal(10,2) NOT NULL, \`interval\` enum ('monthly', 'yearly') NOT NULL, \`user_limit\` int NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_90304db6cb3a8d7d17601328b2\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_90304db6cb3a8d7d17601328b2\` ON \`plans\``);
        await queryRunner.query(`DROP TABLE \`plans\``);
    }

}
