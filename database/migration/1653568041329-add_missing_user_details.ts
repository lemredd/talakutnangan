import { MigrationInterface, QueryRunner } from "typeorm"
import createEnumColumn from "!/data_source/create_enum_column"

export class addMissingUserDetails1653568041329 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn("user", createEnumColumn(queryRunner.connection, {
			name: "kind",
			enum: [ "unreachable_employee", "reachable_employee", "student" ],
			isNullable: false
		}))
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "kind")
	}
}
