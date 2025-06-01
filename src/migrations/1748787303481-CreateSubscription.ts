import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSubscriptions implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'subscriptions',
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
          type: 'uuid',
          isUnique: true,
          default: 'UUID()',
        },
        {
          name: 'account_id',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'plan_id',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'started_at',
          type: 'datetime',
          isNullable: false,
        },
        {
          name: 'ended_at',
          type: 'datetime',
          isNullable: true,
        },
        {
          name: 'cancelled',
          type: 'boolean',
          default: false,
        },
        {
          name: 'status',
          type: 'enum',
          enum: ['ACTIVE', 'CANCELLED', 'EXPIRED', 'PENDING'],
          default: `'PENDING'`,
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

    await queryRunner.createForeignKey('subscriptions', new TableForeignKey({
      columnNames: ['account_id'],
      referencedTableName: 'accounts',
      referencedColumnNames: ['id'],
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    }));

    await queryRunner.createForeignKey('subscriptions', new TableForeignKey({
      columnNames: ['plan_id'],
      referencedTableName: 'plans',
      referencedColumnNames: ['id'],
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('subscriptions');

    if (table) {
      const foreignKeyAccount = table.foreignKeys.find(fk => fk.columnNames.includes('account_id'));
      if (foreignKeyAccount) await queryRunner.dropForeignKey('subscriptions', foreignKeyAccount);

      const foreignKeyPlan = table.foreignKeys.find(fk => fk.columnNames.includes('plan_id'));
      if (foreignKeyPlan) await queryRunner.dropForeignKey('subscriptions', foreignKeyPlan);
    }

    await queryRunner.dropTable('subscriptions');
  }
}
