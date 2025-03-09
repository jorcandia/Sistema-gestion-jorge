import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedMainSeeds1741477929995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminRole = await queryRunner.query(
      "INSERT INTO roles (key, name) VALUES ('admin', 'Administrador') RETURNING id"
    );
    await queryRunner.query(
      "INSERT INTO roles (key, name) VALUES ('user', 'Usuario')"
    );
    await queryRunner.query(`INSERT INTO users (email, password, "roleId", "authStrategy", "createdAt")
            VALUES ('jorge@candia.com', '$2b$10$f2wgGfnPget30OMtkHBlzOWjSe1T/6oxqdbskaE.ygj2XZ6jB6xj2', ${adminRole[0].id}, NULL, '202-01-01T02:02:57.696Z')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM users");
    await queryRunner.query("DELETE FROM roles");
  }
}
