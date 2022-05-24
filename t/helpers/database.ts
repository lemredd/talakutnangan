import { DataSource } from "typeorm"
import User from "!/models/user"
import { Environment, SourceType } from "!/types"
import createDataSource from "!/data_source/create_source"
import getEnvironment from "!/helpers/get_environment"

export default class {
	static #dataSource: DataSource

	static async create() {
		if (getEnvironment() === Environment.UnitTest) {
			this.#dataSource = await createDataSource("unit test")
		} else {
			this.#dataSource = await createDataSource(process.env.DATABASE_TYPE as SourceType)
		}
	}

	static async clear() {
		await this.#dataSource.manager.clear(User)
	}

	static async destroy() {
		await this.#dataSource.destroy()
	}

	static get manager() {
		return this.#dataSource.manager
	}
}
