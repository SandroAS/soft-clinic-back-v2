import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUsers1748787191975 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'users',
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
          isNullable: true,
        },
        {
          name: 'email',
          type: 'varchar',
        },
        {
          name: 'cellphone',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'cpf',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'password',
          type: 'varchar',
        },
        {
          name: 'account_id',
          type: 'int',
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

    await queryRunner.createForeignKey('users', new TableForeignKey({
      columnNames: ['account_id'],
      referencedTableName: 'accounts',
      referencedColumnNames: ['id'],
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.includes('account_id'));
    if (foreignKey) {
      await queryRunner.dropForeignKey('users', foreignKey);
    }

    await queryRunner.dropTable('users');
  }
}
