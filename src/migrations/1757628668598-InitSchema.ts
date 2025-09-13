import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1757628668598 implements MigrationInterface {
  name = 'InitSchema1757628668598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."documents_status_enum" AS ENUM('PENDING', 'SENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "status" "public"."documents_status_enum" NOT NULL DEFAULT 'PENDING', "employeeId" uuid, "documentTypeId" uuid, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "document_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_d467d7eeb7c8ce216e90e8494aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "hiredAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0ac9216832e4dda06946c37cb73" UNIQUE ("cpf"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employees_document_types" ("employeesId" uuid NOT NULL, "documentTypesId" uuid NOT NULL, CONSTRAINT "PK_6779e5bbcc5ac7bccfb8391aaa0" PRIMARY KEY ("employeesId", "documentTypesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_53734129e331f45a663b8a3910" ON "employees_document_types" ("employeesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eefa7d240d122914a6e73165d1" ON "employees_document_types" ("documentTypesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_8424ae83e09a5d8105c418086b3" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_6c6b9775baa0c8973bd829a8e46" FOREIGN KEY ("documentTypeId") REFERENCES "document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees_document_types" ADD CONSTRAINT "FK_53734129e331f45a663b8a39101" FOREIGN KEY ("employeesId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees_document_types" ADD CONSTRAINT "FK_eefa7d240d122914a6e73165d15" FOREIGN KEY ("documentTypesId") REFERENCES "document_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employees_document_types" DROP CONSTRAINT "FK_eefa7d240d122914a6e73165d15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees_document_types" DROP CONSTRAINT "FK_53734129e331f45a663b8a39101"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_6c6b9775baa0c8973bd829a8e46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_8424ae83e09a5d8105c418086b3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eefa7d240d122914a6e73165d1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_53734129e331f45a663b8a3910"`,
    );
    await queryRunner.query(`DROP TABLE "employees_document_types"`);
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(`DROP TABLE "document_types"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TYPE "public"."documents_status_enum"`);
  }
}
