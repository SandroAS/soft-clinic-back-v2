import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnProfileImgUrlToUsers1749676379854 implements MigrationInterface {
    name = 'AddColumnProfileImgUrlToUsers1749676379854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`profile_image_url\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`profile_image_url\``);
    }

}
