import { Sequelize } from "sequelize-typescript"
import { SourceType } from "%/types/independent"
import createSource from "%/data_source/create_source"

export default class Database {
	private static source: Sequelize

	static async initialize(sourceType: SourceType) {
		this.source = await createSource(sourceType)
	}

	static get dataSource(): Sequelize {
		return this.source
	}
}
