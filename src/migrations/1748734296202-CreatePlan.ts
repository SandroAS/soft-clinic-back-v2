import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePlan implements MigrationInterface {
  name = 'CreatePlan';

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
          type: 'varchar',
          isUnique: true,
          default: 'UUID()',
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false,
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
          isNullable: false,
        },
        {
          name: 'interval',
          type: 'enum',
          enum: ['monthly', 'yearly'],
          isNullable: false,
        },
        {
          name: 'user_limit',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'created_at',
          type: 'datetime',
          default: 'CURRENT_TIMESTAMP(6)',
        },
        {
          name: 'updated_at',
          type: 'datetime',
          default: 'CURRENT_TIMESTAMP(6)',
          onUpdate: 'CURRENT_TIMESTAMP(6)',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('plans');
  }
}
