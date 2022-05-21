import { DataSource, DataSourceOptions } from "typeorm"
import User from "!/models/user"

export default async function(configuration: DataSourceOptions): Promise<DataSource> {
	const dataSource = new DataSource({
		...configuration,
		entities: [
			User
		]
	})

	await dataSource.initialize()

	return dataSource
}
