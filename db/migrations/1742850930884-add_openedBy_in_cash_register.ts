import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOpenedByInCashRegister1742850930884 implements MigrationInterface {
    name = 'AddOpenedByInCashRegister1742850930884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cash_registers" ADD "openedById" integer`);
        await queryRunner.query(`ALTER TABLE "cash_registers" ADD CONSTRAINT "FK_28d1fde47fffd110990ee1e4b13" FOREIGN KEY ("openedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cash_registers" DROP CONSTRAINT "FK_28d1fde47fffd110990ee1e4b13"`);
        await queryRunner.query(`ALTER TABLE "cash_registers" DROP COLUMN "openedById"`);
    }

}
