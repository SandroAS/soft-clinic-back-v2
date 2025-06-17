import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAddresses1750202613033 implements MigrationInterface {
    name = 'CreateAddresses1750202613033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`addresses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`cep\` varchar(9) NOT NULL, \`street\` varchar(255) NOT NULL, \`number\` varchar(20) NOT NULL, \`complement\` varchar(255) NULL, \`neighborhood\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` enum ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO') NOT NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_9239128a6170bb533f2eb75b05\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`companies\` ADD \`address_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`companies\` ADD UNIQUE INDEX \`IDX_ad150e1e829fc0c9013267f3e4\` (\`address_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`address_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_1b05689f6b6456680d538c3d2e\` (\`address_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_ad150e1e829fc0c9013267f3e4\` ON \`companies\` (\`address_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_1b05689f6b6456680d538c3d2e\` ON \`users\` (\`address_id\`)`);
        await queryRunner.query(`ALTER TABLE \`companies\` ADD CONSTRAINT \`FK_ad150e1e829fc0c9013267f3e4c\` FOREIGN KEY (\`address_id\`) REFERENCES \`addresses\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_1b05689f6b6456680d538c3d2ea\` FOREIGN KEY (\`address_id\`) REFERENCES \`addresses\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_1b05689f6b6456680d538c3d2ea\``);
        await queryRunner.query(`ALTER TABLE \`companies\` DROP FOREIGN KEY \`FK_ad150e1e829fc0c9013267f3e4c\``);
        await queryRunner.query(`DROP INDEX \`REL_1b05689f6b6456680d538c3d2e\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`REL_ad150e1e829fc0c9013267f3e4\` ON \`companies\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_1b05689f6b6456680d538c3d2e\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`address_id\``);
        await queryRunner.query(`ALTER TABLE \`companies\` DROP INDEX \`IDX_ad150e1e829fc0c9013267f3e4\``);
        await queryRunner.query(`ALTER TABLE \`companies\` DROP COLUMN \`address_id\``);
        await queryRunner.query(`DROP INDEX \`IDX_9239128a6170bb533f2eb75b05\` ON \`addresses\``);
        await queryRunner.query(`DROP TABLE \`addresses\``);
    }

}
