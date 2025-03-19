import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddedMainsTables1740349232405 implements MigrationInterface {
    name = 'AddedMainTables1740349232405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "account_transactions" ("id" SERIAL NOT NULL, "accountId" integer NOT NULL, "amount" integer NOT NULL, "description" character varying NOT NULL, "ObjectId" integer NOT NULL, "objectModel" character varying NOT NULL, CONSTRAINT "PK_bcfbf02d6acfb8fe417296f010d" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "clients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "purchase_details" ("id" SERIAL NOT NULL, "purchaseId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "cost" numeric(9,3) NOT NULL, CONSTRAINT "PK_d3ebfb1c6f9af260a2a63af7204" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "roleId" integer, "email" character varying NOT NULL, "password" character varying NOT NULL, "authStrategy" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "warehouses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, CONSTRAINT "PK_56ae21ee2432b2270b48867e4be" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "providerId" integer NOT NULL, "userId" integer NOT NULL, "wareHouseId" integer NOT NULL, "totalAmount" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "providers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_af13fc2ebf382fe0dad2e4793aa" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "stock_movements" ("id" SERIAL NOT NULL, "wareHouseDetailId" integer NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "objectId" integer NOT NULL, "objectModel" character varying NOT NULL, CONSTRAINT "PK_57a26b190618550d8e65fb860e7" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "providerId" integer NOT NULL, "price" numeric(9,3) NOT NULL, "cost" numeric(10,3) NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "sale_details" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "saleId" integer NOT NULL, "quantity" integer NOT NULL, "price" numeric(9,3) NOT NULL, CONSTRAINT "PK_a8e8b6d243f38e3587378d401f5" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "sales" ("id" SERIAL NOT NULL, "clientId" integer NOT NULL, "userId" integer NOT NULL, "wareHouseId" integer NOT NULL, "cashRegisterId" integer NOT NULL, "totalAmount" numeric(10,3) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(`CREATE TYPE "public"."cash_registers_status_enum" AS ENUM('open', 'closed')`)
        await queryRunner.query(
            `CREATE TABLE "cash_registers" ("id" SERIAL NOT NULL, "number" integer NOT NULL, "amount" numeric(10,3) NOT NULL, "deletedAt" TIMESTAMP, "status" "public"."cash_registers_status_enum" NOT NULL DEFAULT 'closed', CONSTRAINT "PK_c1cc711056395d079d8f041ce34" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "balance" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "warehouse_details" ("id" SERIAL NOT NULL, "warehouseId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_4ea6900bc2ad9068c46d69097c8" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "categories_per_products" ("productId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_6581f6b491dd781dad0390fcc41" PRIMARY KEY ("productId", "categoryId"))`
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_89310f851ac91824fe807f895a" ON "categories_per_products" ("productId") `
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_a68c42eec57901a8ef2024a2be" ON "categories_per_products" ("categoryId") `
        )
        await queryRunner.query(
            `ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_2f0e27fc223b947c853f4e0785e" FOREIGN KEY ("purchaseId") REFERENCES "purchases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "purchase_details" ADD CONSTRAINT "FK_c9189d506a23822e009d1d9af32" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "purchases" ADD CONSTRAINT "FK_341f0dbe584866284359f30f3da" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "purchases" ADD CONSTRAINT "FK_9379d15838258a8b57fae6f1b9d" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "purchases" ADD CONSTRAINT "FK_803645ac7c22fa8b5e4b283a67c" FOREIGN KEY ("wareHouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "products" ADD CONSTRAINT "FK_2135007a246ddab8cbd4ef2bfce" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "sale_details" ADD CONSTRAINT "FK_d7fef51a6c57924613bdb3980cd" FOREIGN KEY ("saleId") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "sale_details" ADD CONSTRAINT "FK_3359bf44dc92a82a768f8f6bc37" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "sales" ADD CONSTRAINT "FK_c0ae0d7fce67f97394e3a250a33" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "sales" ADD CONSTRAINT "FK_52ff6cd9431cc7687c76f935938" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "sales" ADD CONSTRAINT "FK_92c1dc2d2514d50b4fb78c50f32" FOREIGN KEY ("cashRegisterId") REFERENCES "cash_registers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "sales" ADD CONSTRAINT "FK_67b7b325f3606310e6f5e52526a" FOREIGN KEY ("wareHouseId") REFERENCES "warehouses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
        await queryRunner.query(
            `ALTER TABLE "categories_per_products" ADD CONSTRAINT "FK_89310f851ac91824fe807f895a4" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        )
        await queryRunner.query(
            `ALTER TABLE "categories_per_products" ADD CONSTRAINT "FK_a68c42eec57901a8ef2024a2beb" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "categories_per_products" DROP CONSTRAINT "FK_a68c42eec57901a8ef2024a2beb"`
        )
        await queryRunner.query(
            `ALTER TABLE "categories_per_products" DROP CONSTRAINT "FK_89310f851ac91824fe807f895a4"`
        )
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_67b7b325f3606310e6f5e52526a"`)
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_92c1dc2d2514d50b4fb78c50f32"`)
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_52ff6cd9431cc7687c76f935938"`)
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_c0ae0d7fce67f97394e3a250a33"`)
        await queryRunner.query(`ALTER TABLE "sale_details" DROP CONSTRAINT "FK_3359bf44dc92a82a768f8f6bc37"`)
        await queryRunner.query(`ALTER TABLE "sale_details" DROP CONSTRAINT "FK_d7fef51a6c57924613bdb3980cd"`)
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_2135007a246ddab8cbd4ef2bfce"`)
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_803645ac7c22fa8b5e4b283a67c"`)
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_9379d15838258a8b57fae6f1b9d"`)
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_341f0dbe584866284359f30f3da"`)
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`)
        await queryRunner.query(`ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_c9189d506a23822e009d1d9af32"`)
        await queryRunner.query(`ALTER TABLE "purchase_details" DROP CONSTRAINT "FK_2f0e27fc223b947c853f4e0785e"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_a68c42eec57901a8ef2024a2be"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_89310f851ac91824fe807f895a"`)
        await queryRunner.query(`DROP TABLE "categories_per_products"`)
        await queryRunner.query(`DROP TABLE "warehouse_details"`)
        await queryRunner.query(`DROP TABLE "accounts"`)
        await queryRunner.query(`DROP TABLE "cash_registers"`)
        await queryRunner.query(`DROP TYPE "public"."cash_registers_status_enum"`)
        await queryRunner.query(`DROP TABLE "sales"`)
        await queryRunner.query(`DROP TABLE "sale_details"`)
        await queryRunner.query(`DROP TABLE "products"`)
        await queryRunner.query(`DROP TABLE "stock_movements"`)
        await queryRunner.query(`DROP TABLE "providers"`)
        await queryRunner.query(`DROP TABLE "purchases"`)
        await queryRunner.query(`DROP TABLE "warehouses"`)
        await queryRunner.query(`DROP TABLE "users"`)
        await queryRunner.query(`DROP TABLE "roles"`)
        await queryRunner.query(`DROP TABLE "purchase_details"`)
        await queryRunner.query(`DROP TABLE "categories"`)
        await queryRunner.query(`DROP TABLE "clients"`)
        await queryRunner.query(`DROP TABLE "account_transactions"`)
    }
}
