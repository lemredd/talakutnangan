import { MigrationInterface, QueryRunner } from "typeorm"
import makeEnumColumn from "%/data_source/make_enum_column"
import makeFileColumn from "%/data_source/make_file_column"
import makeCreatedAtColumn from "%/data_source/make_created_at_column"
import makeUpdatedAtColumn from "%/data_source/make_updated_at_column"
import makeDeletedAtColumn from "%/data_source/make_deleted_at_column"

export class addMissingUserDetails1653568041329 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn("user", makeEnumColumn(queryRunner.connection, {
			name: "kind",
			enum: [ "unreachable_employee", "reachable_employee", "student" ],
			isNullable: false
		}))
		await queryRunner.addColumn("user", makeFileColumn(queryRunner.connection, {
			name: "signature",
			isNullable: true
		}))
		await queryRunner.addColumn("user", makeCreatedAtColumn(queryRunner.connection))
		await queryRunner.addColumn("user", makeUpdatedAtColumn(queryRunner.connection))
		await queryRunner.addColumn("user", makeDeletedAtColumn(queryRunner.connection))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "kind")
		await queryRunner.dropColumn("user", "signature")
		await queryRunner.dropColumn("user", "createdAt")
		await queryRunner.dropColumn("user", "updatedAt")
		await queryRunner.dropColumn("user", "deletedAt")
	}
}
