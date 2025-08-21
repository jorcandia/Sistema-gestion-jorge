import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToPurchases1755613941552 implements MigrationInterface {
    name = 'AddSoftDeleteToPurchases1755613941552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_details" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "purchase_details" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "purchase_details" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "purchase_details" DROP COLUMN "createdAt"`);
    }

}
