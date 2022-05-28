import { MigrationInterface, QueryRunner } from "typeorm"
import createEnumColumn from "!/data_source/create_enum_column"
import createFileColumn from "!/data_source/create_file_column"

export class addMissingUserDetails1653568041329 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn("user", createEnumColumn(queryRunner.connection, {
			name: "kind",
			enum: [ "unreachable_employee", "reachable_employee", "student" ],
			isNullable: false
		}))
		await queryRunner.addColumn("user", createFileColumn(queryRunner.connection, {
			name: "signature",
			isNullable: true
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "kind")
		await queryRunner.dropColumn("user", "signature")
	}
}
