import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPurchaseAndPurchaseDetails1741994981532 implements MigrationInterface {
    name = 'AddPurchaseAndPurchaseDetails1741994981532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchase_details" ("id" SERIAL NOT NULL, "purchseId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "cost" numeric(9,3) NOT NULL, CONSTRAINT "PK_d3ebfb1c6f9af260a2a63af7204" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "providerId" integer NOT NULL, "userId" integer NOT NULL, "totalAmount" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "purchases"`);
        await queryRunner.query(`DROP TABLE "purchase_details"`);
    }

}
