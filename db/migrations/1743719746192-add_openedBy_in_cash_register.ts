import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOpenedByInCashRegister1743719746192 implements MigrationInterface {
    name = 'AddOpenedByInCashRegister1743719746192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cash_registers" ADD "openedBy" integer`);
        await queryRunner.query(`ALTER TABLE "cash_registers" ADD CONSTRAINT "FK_5b98c1858ccc3e1f748adbf9e70" FOREIGN KEY ("openedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cash_registers" DROP CONSTRAINT "FK_5b98c1858ccc3e1f748adbf9e70"`);
        await queryRunner.query(`ALTER TABLE "cash_registers" DROP COLUMN "openedBy"`);
    }

}
