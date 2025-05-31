import { MigrationInterface, QueryRunner } from "typeorm";

export class NomeDaMigration1748732923023 implements MigrationInterface {
    name = 'NomeDaMigration1748732923023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL DEFAULT UUID(), \`name\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`cellphone\` varchar(255) NULL, \`cpf\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`account_id\` int NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a95e949168be7b7ece1a2382fe\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`subscriptions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL DEFAULT UUID(), \`account_id\` int NOT NULL, \`plan_id\` int NOT NULL, \`started_at\` datetime NOT NULL, \`ended_at\` datetime NULL, \`cancelled\` tinyint NOT NULL DEFAULT 0, \`status\` enum ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING') NOT NULL DEFAULT 'PENDING', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_eb660c4a66c2c5d34455340100\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`plans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL DEFAULT UUID(), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`price\` decimal(10,2) NOT NULL, \`interval\` enum ('monthly', 'yearly') NOT NULL, \`user_limit\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_90304db6cb3a8d7d17601328b2\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL DEFAULT UUID(), \`admin_id\` int NOT NULL, \`plan_id\` int NULL, \`current_subscription_id\` int NULL, \`last_trial_id\` int NULL, \`in_trial\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_45705ce5c594e0b9f6158a4337\` (\`uuid\`), UNIQUE INDEX \`REL_7e32a3b38f3fec3adf342b5b42\` (\`current_subscription_id\`), UNIQUE INDEX \`REL_7f9954637355c3a36afffcc45c\` (\`last_trial_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`trials\` (\`id\` int NOT NULL AUTO_INCREMENT, \`uuid\` varchar(255) NOT NULL DEFAULT UUID(), \`started_at\` datetime NOT NULL, \`ended_at\` datetime NULL, \`account_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_35b28eced13b5eafe3e0f85d63\` (\`uuid\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_6acfec7285fdf9f463462de3e9f\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_7c7bc85becc85aec89c103784e6\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` ADD CONSTRAINT \`FK_e45fca5d912c3a2fab512ac25dc\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_61992fd53978b85911504fb9127\` FOREIGN KEY (\`admin_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_ec3913403cfe3d432d10a6b86fb\` FOREIGN KEY (\`plan_id\`) REFERENCES \`plans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_7e32a3b38f3fec3adf342b5b428\` FOREIGN KEY (\`current_subscription_id\`) REFERENCES \`subscriptions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_7f9954637355c3a36afffcc45c3\` FOREIGN KEY (\`last_trial_id\`) REFERENCES \`trials\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`trials\` ADD CONSTRAINT \`FK_a019ec86964204bb7404f8395fa\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trials\` DROP FOREIGN KEY \`FK_a019ec86964204bb7404f8395fa\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_7f9954637355c3a36afffcc45c3\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_7e32a3b38f3fec3adf342b5b428\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_ec3913403cfe3d432d10a6b86fb\``);
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_61992fd53978b85911504fb9127\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_e45fca5d912c3a2fab512ac25dc\``);
        await queryRunner.query(`ALTER TABLE \`subscriptions\` DROP FOREIGN KEY \`FK_7c7bc85becc85aec89c103784e6\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_6acfec7285fdf9f463462de3e9f\``);
        await queryRunner.query(`DROP INDEX \`IDX_35b28eced13b5eafe3e0f85d63\` ON \`trials\``);
        await queryRunner.query(`DROP TABLE \`trials\``);
        await queryRunner.query(`DROP INDEX \`REL_7f9954637355c3a36afffcc45c\` ON \`accounts\``);
        await queryRunner.query(`DROP INDEX \`REL_7e32a3b38f3fec3adf342b5b42\` ON \`accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_45705ce5c594e0b9f6158a4337\` ON \`accounts\``);
        await queryRunner.query(`DROP TABLE \`accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_90304db6cb3a8d7d17601328b2\` ON \`plans\``);
        await queryRunner.query(`DROP TABLE \`plans\``);
        await queryRunner.query(`DROP INDEX \`IDX_eb660c4a66c2c5d34455340100\` ON \`subscriptions\``);
        await queryRunner.query(`DROP TABLE \`subscriptions\``);
        await queryRunner.query(`DROP INDEX \`IDX_a95e949168be7b7ece1a2382fe\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
