import { Database } from "sqlite3"
import { DataSource } from "typeorm"
import createDataSource from "!/create_data_source"
import User from "!/models/user"

export default class DatabaseHelper {
	static #instance: DatabaseHelper|null

	#database: Database|null = null
	#dataSource: DataSource|null = null

	constructor() {
		if (DatabaseHelper.#instance === null) {
			DatabaseHelper.#instance = this
		}

		return DatabaseHelper.#instance
	}

	async create() {
		this.#database = new Database(":memory:")
		this.#dataSource = await createDataSource({
			type: "sqlite",
			database: ":memory:"
		})
	}

	async clear() {
		await this.#dataSource?.manager.clear(User)
	}

	async destroy() {
		await this.#dataSource?.destroy()
		this.#database?.close()
	}

	get manager() {
		return this.#dataSource?.manager
	}
}
