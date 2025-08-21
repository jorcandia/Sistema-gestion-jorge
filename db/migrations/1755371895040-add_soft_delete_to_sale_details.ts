import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToSaleDetails1755371895040 implements MigrationInterface {
    name = 'AddSoftDeleteToSaleDetails1755371895040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_details" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sale_details" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" ADD CONSTRAINT "FK_0447316a8d2da75de15565e0de0" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" ADD CONSTRAINT "FK_15d60f71c4bbd8ce76795d4d816" FOREIGN KEY ("warehouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse_details" DROP CONSTRAINT "FK_15d60f71c4bbd8ce76795d4d816"`);
        await queryRunner.query(`ALTER TABLE "warehouse_details" DROP CONSTRAINT "FK_0447316a8d2da75de15565e0de0"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "sales" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "sale_details" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "sale_details" DROP COLUMN "createdAt"`);
    }

}
