import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtStockMovements1742350956234 implements MigrationInterface {
    name = 'AddCreatedAtStockMovements1742350956234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_movements" ALTER COLUMN "createdAt" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_movements" ALTER COLUMN "createdAt" DROP DEFAULT`);
    }

}
