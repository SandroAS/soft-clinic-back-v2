import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddRelationshipsToAccounts implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey('accounts', new TableForeignKey({
      columnNames: ['admin_id'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    }));

    await queryRunner.createForeignKey('accounts', new TableForeignKey({
      columnNames: ['current_subscription_id'],
      referencedTableName: 'subscriptions',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    }));

    await queryRunner.createForeignKey('accounts', new TableForeignKey({
      columnNames: ['last_trial_id'],
      referencedTableName: 'trials',
      referencedColumnNames: ['id'],
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('accounts');

    if (!table) return;

    const fkAdmin = table.foreignKeys.find(fk => fk.columnNames.includes('admin_id'));
    if (fkAdmin) await queryRunner.dropForeignKey('accounts', fkAdmin);

    const fkSubscription = table.foreignKeys.find(fk => fk.columnNames.includes('current_subscription_id'));
    if (fkSubscription) await queryRunner.dropForeignKey('accounts', fkSubscription);

    const fkTrial = table.foreignKeys.find(fk => fk.columnNames.includes('last_trial_id'));
    if (fkTrial) await queryRunner.dropForeignKey('accounts', fkTrial);
  }
}
