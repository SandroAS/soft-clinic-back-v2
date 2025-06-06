import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipsAccountsToUsers1748797776711 implements MigrationInterface {
    name = 'AddRelationshipsAccountsToUsers1748797776711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_61992fd53978b85911504fb9127\` FOREIGN KEY (\`admin_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_6acfec7285fdf9f463462de3e9f\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_6acfec7285fdf9f463462de3e9f\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_61992fd53978b85911504fb9127\``);
    }

}
