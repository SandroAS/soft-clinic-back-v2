import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissions1749302807454 implements MigrationInterface {
    name = 'CreatePermissions1749302807454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_48ce552495d14eae9b187bb671\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role_has_permissions\` (\`role_id\` int NOT NULL, \`permission_id\` int NOT NULL, INDEX \`IDX_9135e97d2d840f7dfd6e664911\` (\`role_id\`), INDEX \`IDX_09ff9df62bd01f8cf45b1b1921\` (\`permission_id\`), PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`role_has_permissions\` ADD CONSTRAINT \`FK_9135e97d2d840f7dfd6e6649116\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`role_has_permissions\` ADD CONSTRAINT \`FK_09ff9df62bd01f8cf45b1b1921a\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`role_has_permissions\` DROP FOREIGN KEY \`FK_09ff9df62bd01f8cf45b1b1921a\``);
        await queryRunner.query(`ALTER TABLE \`role_has_permissions\` DROP FOREIGN KEY \`FK_9135e97d2d840f7dfd6e6649116\``);
        await queryRunner.query(`DROP INDEX \`IDX_09ff9df62bd01f8cf45b1b1921\` ON \`role_has_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_9135e97d2d840f7dfd6e664911\` ON \`role_has_permissions\``);
        await queryRunner.query(`DROP TABLE \`role_has_permissions\``);
        await queryRunner.query(`DROP INDEX \`IDX_48ce552495d14eae9b187bb671\` ON \`permissions\``);
        await queryRunner.query(`DROP TABLE \`permissions\``);
    }

}
