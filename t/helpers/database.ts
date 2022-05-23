import { DataSource } from "typeorm"
import createDataSource from "!/create_data_source"
import User from "!/models/user"

export default class {
	static #dataSource: DataSource

	static async create() {
		this.#dataSource = await createDataSource("test")
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
