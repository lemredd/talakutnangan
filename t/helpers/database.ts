import { Sequelize } from "sequelize-typescript"

import { SourceType } from "%/types"
import { Environment } from "!/types/independent"
import getEnvironment from "!/helpers/get_environment"
import createDataSource from "%/data_source/create_source"

import User from "%/models/user"
import Department from "%/models/department"

export default class {
	static #dataSource: Sequelize

	static async create(): Promise<void> {
		if (getEnvironment() === Environment.UnitTest) {
			this.#dataSource = createDataSource("unit_test")
		} else {
			this.#dataSource = createDataSource(process.env.DATABASE_TYPE as SourceType)
		}

		await this.#dataSource.sync({ force: true })
	}

	static async clear(): Promise<void> {
		// See: https://github.com/sequelize/sequelize/issues/11289
		// See: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/098668baad17230742eaa9da5a10c2e338e7b71d/types/sequelize/index.d.ts#L3564
		await User.truncate({ force: true, cascade: true })
		await Department.truncate({ force: true })
	}

	static async destroy(): Promise<void> {
		await this.dataSource?.close()
	}

	static get dataSource() {
		return this.#dataSource
	}
}
