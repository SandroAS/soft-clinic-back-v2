import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServices1751209057844 implements MigrationInterface {
    name = 'CreateServices1751209057844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_019d74f7abcdcb5a0113010cb0\` ON \`services\``);
        await queryRunner.query(`ALTER TABLE \`services\` ADD \`account_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`services\` ADD \`system_module_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`system_modules\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`system_modules\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`system_modules\` ADD \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f46f17703dc6f012bd6b40c7eb\` ON \`services\` (\`name\`, \`system_module_id\`, \`account_id\`)`);
        await queryRunner.query(`ALTER TABLE \`services\` ADD CONSTRAINT \`FK_166b31c9827daf5cc8977e68575\` FOREIGN KEY (\`account_id\`) REFERENCES \`accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`services\` ADD CONSTRAINT \`FK_4859826153c9dd5df7b90bc35b5\` FOREIGN KEY (\`system_module_id\`) REFERENCES \`system_modules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_4859826153c9dd5df7b90bc35b5\``);
        await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_166b31c9827daf5cc8977e68575\``);
        await queryRunner.query(`DROP INDEX \`IDX_f46f17703dc6f012bd6b40c7eb\` ON \`services\``);
        await queryRunner.query(`ALTER TABLE \`system_modules\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`system_modules\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`system_modules\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`system_module_id\``);
        await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`account_id\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_019d74f7abcdcb5a0113010cb0\` ON \`services\` (\`name\`)`);
    }

}
