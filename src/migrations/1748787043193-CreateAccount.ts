import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAccounts implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'accounts',
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
          name: 'admin_id',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'plan_id',
          type: 'int',
          isNullable: true,
          default: 1,
        },
        {
          name: 'current_subscription_id',
          type: 'int',
          isNullable: true,
          isUnique: true,
        },
        {
          name: 'last_trial_id',
          type: 'int',
          isNullable: true,
          isUnique: true,
        },
        {
          name: 'in_trial',
          type: 'tinyint',
          default: 1,
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

    await queryRunner.createForeignKey('accounts', new TableForeignKey({
      columnNames: ['plan_id'],
      referencedTableName: 'plans',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
      onUpdate: 'NO ACTION',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('accounts');
    const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('plan_id'));
    if (foreignKey) {
      await queryRunner.dropForeignKey('accounts', foreignKey);
    }

    await queryRunner.dropTable('accounts');
  }
}
