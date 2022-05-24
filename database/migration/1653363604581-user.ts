import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class user1653363604581 implements MigrationInterface {
	name = 'user1653363604581'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "user",
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment"
					},
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
					{
						name: "admittedAt",
						type: "datetime",
						isNullable: true,
						default: null
					},
					{
						name: "emailVerifiedAt",
						type: "datetime",
						isNullable: true,
						default: null
					}
				]
			}),
			true
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("user");
	}
}
