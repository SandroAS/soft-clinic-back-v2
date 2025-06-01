import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePlan1748734296202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'plans',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'uuid',
          type: 'char',
          length: '36',
          isUnique: true,
        },
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'description',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'price',
          type: 'decimal',
          precision: 10,
          scale: 2,
        },
        {
          name: 'interval',
          type: 'enum',
          enum: ['monthly', 'yearly'],
        },
        {
          name: 'user_limit',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          onUpdate: 'CURRENT_TIMESTAMP',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('plans');
  }
}
