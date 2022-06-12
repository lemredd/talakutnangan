import { Sequelize, SequelizeOptions } from "sequelize-typescript"

import type { SourceType } from "%/types"

import User from "%/models/user"
import Department from "%/models/department"
import createConfiguration from "%/configuration/create"

export default async function(type: SourceType): Promise<Sequelize> {
	const configuration: SequelizeOptions = createConfiguration(type) as SequelizeOptions
	const sequelize = new Sequelize({
		...configuration,
		models: [
			User,
			Department
		]
	})

	return sequelize
}
