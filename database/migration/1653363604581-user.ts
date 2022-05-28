import { MigrationInterface, QueryRunner, Table } from "typeorm";
import makeIDColumn from "!/data_source/make_id_column"
import makeDateColumn from "!/data_source/make_date_column"

export class user1653363604581 implements MigrationInterface {
	name = 'user1653363604581'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "user",
				columns: [
					makeIDColumn(queryRunner.connection),
					{
						name: "email",
						type: "varchar",
						isNullable: false,
						isUnique: true
					},
					{
						name: "password",
						type: "varchar",
						isNullable: false
					},
					makeDateColumn(queryRunner.connection, {
						name: "admittedAt",
						isNullable: true,
						default: null
					}),
					makeDateColumn(queryRunner.connection, {
						name: "emailVerifiedAt",
						isNullable: true,
						default: null
					})
				]
			}),
			true
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("user");
	}
}
