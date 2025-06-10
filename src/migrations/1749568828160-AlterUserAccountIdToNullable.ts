import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserAccountIdToNullable1749568828160 implements MigrationInterface {
    name = 'AlterUserAccountIdToNullable1749568828160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_17a709b8b6146c491e6615c29d7\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`account_id\` \`account_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_17a709b8b6146c491e6615c29d7\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_17a709b8b6146c491e6615c29d7\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`account_id\` \`account_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_17a709b8b6146c491e6615c29d7\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
