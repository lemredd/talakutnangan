import { DataSource, DataSourceOptions } from "typeorm"
import User from "!/models/user"
import type { SourceType } from "!/types"

export default async function(type: SourceType): Promise<DataSource> {
	const dataSourceOptions: { [key: string]: string|number|boolean } = {}

	switch(type) {
		case "pgsql": {
			dataSourceOptions.type = "pgsql"
			dataSourceOptions.url = process.env.DATABASE_URL
			dataSourceOptions.synchronize = true
			dataSourceOptions.logging = true
		}
		case "mysql": {
			dataSourceOptions.type = "mysql"
			dataSourceOptions.host = process.env.DATABASE_HOST
			dataSourceOptions.port = process.env.DATABASE_PORT as unknown as number
			dataSourceOptions.database = process.env.DATABASE_NAME
			dataSourceOptions.username = process.env.DATABASE_USER
			dataSourceOptions.password = process.env.DATABASE_PASS
			dataSourceOptions.synchronize = true
			dataSourceOptions.logging = true
			break
		}
		case "memoried_sqlite": {
			dataSourceOptions.type = "sqlite"
			dataSourceOptions.database = ":memory:"
			dataSourceOptions.synchronize = true
			dataSourceOptions.logging = true
			break
		}
		case "filed_sqlite": {
			dataSourceOptions.type = "sqlite"
			dataSourceOptions.database = process.env.DATABASE_PATH
			dataSourceOptions.synchronize = true
			dataSourceOptions.logging = true
			break
		}
		case "unit test": {
			dataSourceOptions.type = "sqlite"
			dataSourceOptions.database = ":memory:"
			dataSourceOptions.synchronize = true
			break
		}
	}

	const dataSource = new DataSource({
		...dataSourceOptions as unknown as DataSourceOptions,
		entities: [
			User
		]
	})

	await dataSource.initialize()

	return dataSource
}
