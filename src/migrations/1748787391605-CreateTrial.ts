import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTrials implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'trials',
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
          name: 'account_id',
          type: 'int',
          isNullable: false,
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

    await queryRunner.createForeignKey('trials', new TableForeignKey({
      columnNames: ['account_id'],
      referencedTableName: 'accounts',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('trials');

    if (table) {
      const foreignKeyAccount = table.foreignKeys.find(fk => fk.columnNames.includes('account_id'));
      if (foreignKeyAccount) await queryRunner.dropForeignKey('trials', foreignKeyAccount);
    }

    await queryRunner.dropTable('trials');
  }
}
