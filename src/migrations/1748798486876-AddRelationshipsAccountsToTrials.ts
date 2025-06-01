import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipsAccountsToTrials1748798486876 implements MigrationInterface {
    name = 'AddRelationshipsAccountsToTrials1748798486876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD UNIQUE INDEX \`IDX_7f9954637355c3a36afffcc45c\` (\`last_trial_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_7f9954637355c3a36afffcc45c\` ON \`accounts\` (\`last_trial_id\`)`);
        await queryRunner.query(`ALTER TABLE \`trials\` ADD CONSTRAINT \`FK_a019ec86964204bb7404f8395fa\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_7f9954637355c3a36afffcc45c3\` FOREIGN KEY (\`last_trial_id\`) REFERENCES \`trials\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_7f9954637355c3a36afffcc45c3\``);
        await queryRunner.query(`ALTER TABLE \`trials\` DROP FOREIGN KEY \`FK_a019ec86964204bb7404f8395fa\``);
        await queryRunner.query(`DROP INDEX \`REL_7f9954637355c3a36afffcc45c\` ON \`accounts\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP INDEX \`IDX_7f9954637355c3a36afffcc45c\``);
    }

}
