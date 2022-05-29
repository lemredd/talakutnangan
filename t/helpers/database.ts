import { DataSource } from "typeorm"
import User from "%/models/user"
import { Environment, SourceType } from "!/types"
import getEnvironment from "!/helpers/get_environment"
import createDataSource from "%/data_source/create_source"

export default class {
	private static dataSource: DataSource

	static async create(): Promise<void> {
		if (getEnvironment() === Environment.UnitTest) {
			this.dataSource = await Promise.resolve(createDataSource("unit test"))
		} else {
			this.dataSource = await Promise.resolve(
				createDataSource(process.env.DATABASE_TYPE as SourceType)
			)
		}
	}

	static async clear(): Promise<void> {
		await this.dataSource.manager.clear(User)
	}

	static async destroy(): Promise<void> {
		await this.dataSource?.destroy()
	}

	static get manager() {
		return this.dataSource.manager
	}
}
