import { MigrationInterface, QueryRunner } from "typeorm"
import makeEnumColumn from "!/data_source/make_enum_column"
import makeFileColumn from "!/data_source/make_file_column"

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
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "kind")
		await queryRunner.dropColumn("user", "signature")
	}
}
