import { DataSource, DataSourceOptions } from "typeorm"
import User from "!/models/user"
import getRoot from "!/helpers/get_root"
import type { SourceType } from "!/types"

export default function(
	type: SourceType,
	mustInitialize: boolean = true
): DataSource|Promise<DataSource> {
	const dataSourceOptions: { [key: string]: string|number|boolean } = {}

	switch(type) {
		case "pgsql": {
			dataSourceOptions.type = "postgres"
			dataSourceOptions.url = process.env.DATABASE_URL
			dataSourceOptions.synchronize = false
			dataSourceOptions.logging = true
			break
		}
		case "mysql": {
			dataSourceOptions.type = "mysql"
			dataSourceOptions.host = process.env.DATABASE_HOST
			dataSourceOptions.port = process.env.DATABASE_PORT as unknown as number
			dataSourceOptions.database = process.env.DATABASE_NAME
			dataSourceOptions.username = process.env.DATABASE_USER
			dataSourceOptions.password = process.env.DATABASE_PASS
			dataSourceOptions.synchronize = false
			dataSourceOptions.logging = true
			break
		}
		case "memoried_sqlite": {
			dataSourceOptions.type = "sqlite"
			dataSourceOptions.database = ":memory:"
			dataSourceOptions.synchronize = false
			dataSourceOptions.logging = true
			break
		}
		case "filed_sqlite": {
			dataSourceOptions.type = "sqlite"
			dataSourceOptions.database = process.env.DATABASE_PATH
			dataSourceOptions.synchronize = false
			dataSourceOptions.logging = true
			break
		}
		case "unit test": {
			dataSourceOptions.type = "sqlite"
			dataSourceOptions.database = ":memory:"
			dataSourceOptions.synchronize = false
			break
		}
	}

	const root = getRoot()
	const dataSource = new DataSource({
		...dataSourceOptions as unknown as DataSourceOptions,
		entities: [
			User
		],
		migrations: [
			`${root}/database/migration/*-*.ts`
		]
	})

	if (mustInitialize) {
		return dataSource.initialize()
			.then(() => dataSource.runMigrations())
			.then(() => dataSource)
	} else {
		return dataSource
	}
}
