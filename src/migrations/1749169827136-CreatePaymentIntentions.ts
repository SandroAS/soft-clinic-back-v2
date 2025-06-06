import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentIntentions1749169827136 implements MigrationInterface {
    name = 'CreatePaymentIntentions1749169827136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_6acfec7285fdf9f463462de3e9f\``);
        await queryRunner.query(`DROP INDEX \`IDX_a95e949168be7b7ece1a2382fe\` ON \`users\``);
        await queryRunner.query(`CREATE TABLE \`payment_intentions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`amount\` decimal NOT NULL, \`method\` varchar(255) NOT NULL, \`pixCopyPaste\` text NULL, \`qr_code_img_url\` varchar(255) NULL, \`bar_code\` varchar(255) NULL, \`bar_code_img_url\` varchar(255) NULL, \`expires_at\` datetime NULL, \`parent_intention_id\` int NULL, \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_d270b31d66eab6ac0ee51630ca\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_951b8f1dfc94ac1d0301a14b7e\` (\`uuid\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_17a709b8b6146c491e6615c29d7\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` ADD CONSTRAINT \`FK_405e117763871cbdb9d9fa8e69f\` FOREIGN KEY (\`parent_intention_id\`) REFERENCES \`payment_intentions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment_intentions\` DROP FOREIGN KEY \`FK_405e117763871cbdb9d9fa8e69f\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_17a709b8b6146c491e6615c29d7\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_951b8f1dfc94ac1d0301a14b7e\``);
        await queryRunner.query(`DROP INDEX \`IDX_d270b31d66eab6ac0ee51630ca\` ON \`payment_intentions\``);
        await queryRunner.query(`DROP TABLE \`payment_intentions\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_a95e949168be7b7ece1a2382fe\` ON \`users\` (\`uuid\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_6acfec7285fdf9f463462de3e9f\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
