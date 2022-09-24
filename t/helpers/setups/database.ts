/* eslint-disable max-len */
import { Sequelize } from "sequelize-typescript"

import Database from "%/data_source/database"
import isUndefined from "$/type_guards/is_undefined"
import getDataSourceType from "~/setups/get_data_source_type"

export default class {
	static #dataSource: Sequelize|undefined

	static async create(): Promise<void> {
		if (isUndefined(Database.dataSource)) {
			await Database.initialize(getDataSourceType())
		}

		this.#dataSource = Database.dataSource

		await this.#dataSource.sync({ "force": true })
	}

	static async clear(): Promise<void> {
		/*
		 * See: https://github.com/sequelize/sequelize/issues/11289
		 * See: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/098668baad17230742eaa9da5a10c2e338e7b71d/types/sequelize/index.d.ts#L3564
		 */
		await this.dataSource?.truncate({
			"cascade": true,
			"force": true
		})
	}

	static async destroy(): Promise<void> {
		await this.dataSource?.close()
		// @ts-ignore
		// eslint-disable-next-line no-undefined
		this.#dataSource = undefined
	}

	static get dataSource() {
		return this.#dataSource
	}
}
