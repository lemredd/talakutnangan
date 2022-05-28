import { MigrationInterface, QueryRunner, Table } from "typeorm";
import createIDColumn from "!/data_source/create_id_column"
import createDateColumn from "!/data_source/create_date_column"

export class user1653363604581 implements MigrationInterface {
	name = 'user1653363604581'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "user",
				columns: [
					createIDColumn(queryRunner.connection),
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
					createDateColumn(queryRunner.connection, {
						name: "admittedAt",
						isNullable: true,
						default: null
					}),
					createDateColumn(queryRunner.connection, {
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
