import { Sequelize } from "sequelize-typescript"
import { SourceType } from "$/types/database"
import createSource from "%/data_source/create_source"

export default class Database {
	private static source: Sequelize
	private static sourceType: SourceType

	static async initialize(sourceType: SourceType) {
		this.source = await createSource(sourceType)
		this.sourceType = sourceType
	}

	static get dataSource(): Sequelize {
		return this.source
	}

	static get isOnSQLite(): boolean {
		const SQLiteModes: SourceType[] = [ "filed_sqlite", "memoried_sqlite", "unit_test" ]
		return SQLiteModes.includes(this.sourceType)
	}

	static get isOnMySQL(): boolean {
		return this.sourceType === "mysql"
	}

	static get isOnPostgreSQL(): boolean {
		return this.sourceType === "pgsql"
	}
}
