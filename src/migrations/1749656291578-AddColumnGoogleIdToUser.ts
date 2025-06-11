import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnGoogleIdToUser1749656291578 implements MigrationInterface {
    name = 'AddColumnGoogleIdToUser1749656291578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`google_id\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_0bd5012aeb82628e07f6a1be53\` (\`google_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_0bd5012aeb82628e07f6a1be53\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`google_id\``);
    }

}
