import { Sequelize } from "sequelize-typescript"

import Database from "%/data_source/database"

export default class {
	static #dataSource: Sequelize

	static async create(): Promise<void> {
		this.#dataSource = Database.dataSource

		await this.#dataSource.sync({ force: true })
	}

	static async clear(): Promise<void> {
		// See: https://github.com/sequelize/sequelize/issues/11289
		// See: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/098668baad17230742eaa9da5a10c2e338e7b71d/types/sequelize/index.d.ts#L3564
		await this.dataSource.truncate({ force: true, cascade: true })
	}

	static async destroy(): Promise<void> {
		await this.dataSource?.close()
	}

	static get dataSource() {
		return this.#dataSource
	}
}
