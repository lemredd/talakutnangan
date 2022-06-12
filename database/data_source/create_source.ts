import { Sequelize, SequelizeOptions } from "sequelize-typescript"

import type { SourceType } from "%/types"

import Log from "!/helpers/log"
import Role from "%/models/role"
import User from "%/models/user"
import Department from "%/models/department"
import createConfiguration from "%/configuration/create"

export default async function(type: SourceType): Promise<Sequelize> {
	const configuration: SequelizeOptions = createConfiguration(type) as SequelizeOptions
	const sequelize = new Sequelize({
		...configuration,
		logging: (query: string) => {
			Log.trace("query", query)
		},
		models: [
			Role,
			User,
			Department
		]
	})

	try {
		await sequelize.authenticate()
		Log.success("server", "Connected to the database server")
	} catch(error) {
		Log.errorMessage("server", "Cannot connect to the database")
		Log.error("server", error as Error)
	}

	return sequelize
}
