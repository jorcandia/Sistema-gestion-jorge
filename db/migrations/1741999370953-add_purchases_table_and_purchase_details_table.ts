import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPurchasesTableAndPurchaseDetailsTable1741999370953 implements MigrationInterface {
    name = 'AddPurchasesTableAndPurchaseDetailsTable1741999370953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "providerId" integer NOT NULL, "userId" integer NOT NULL, "totalAmount" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase_details" ("id" SERIAL NOT NULL, "purchaseId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "cost" numeric(9,3) NOT NULL, CONSTRAINT "PK_d3ebfb1c6f9af260a2a63af7204" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_341f0dbe584866284359f30f3da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_2f0e27fc223b947c853f4e0785e" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_c9189d506a23822e009d1d9af32" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_c9189d506a23822e009d1d9af32"`);
        await queryRunner.query(`ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_2f0e27fc223b947c853f4e0785e"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_341f0dbe584866284359f30f3da"`);
        await queryRunner.query(`DROP TABLE "purchase_details"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
    }

}
