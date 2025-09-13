import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTitleToDocuments1757645453765 implements MigrationInterface {
    name = 'AddTitleToDocuments1757645453765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "content" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "title"`);
    }

}
