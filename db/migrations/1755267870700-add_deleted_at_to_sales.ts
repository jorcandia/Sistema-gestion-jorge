import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDeletedAtToSales1755267870700 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sales" 
            ADD COLUMN "deletedAt" TIMESTAMP WITH TIME ZONE
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "sales" 
            DROP COLUMN "deletedAt"
        `)
    }
}
