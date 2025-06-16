import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipUsersToCompanies1750090995589 implements MigrationInterface {
    name = 'AddRelationshipUsersToCompanies1750090995589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`companies\` ADD CONSTRAINT \`FK_ee0839cba07cb0c52602021ad4b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`companies\` DROP FOREIGN KEY \`FK_ee0839cba07cb0c52602021ad4b\``);
    }

}
