import { Sequelize } from "sequelize-typescript"
import { Environment } from "!/types"
import getEnvironment from "!/helpers/get_environment"
import createDataSource from "%/data_source/create_source"

export default class {
	static #dataSource: Sequelize

	static async create(): Promise<void> {
		if (getEnvironment() === Environment.UnitTest) {
			this.#dataSource = createDataSource("unit_test")
		} else {
			this.#dataSource = createDataSource(process.env.DATABASE_TYPE as SourceType)
		}
	}

	static async clear(): Promise<void> {
		await this.dataSource.drop()
	}

	static async destroy(): Promise<void> {
		await this.dataSource.close()
	}

	static get dataSource() {
		return this.#dataSource
	}
}
