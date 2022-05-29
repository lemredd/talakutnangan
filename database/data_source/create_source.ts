import { Sequelize, SequelizeOptions } from "sequelize-typescript"

import User from "%/models/user"
import type { SourceType } from "%/types"
import createConfiguration from "%/configuration/create"

export default function(type: SourceType): Sequelize {
	const configuration: SequelizeOptions = createConfiguration() as SequelizeOptions
	const sequelize = new Sequelize({
		...configuration,
		models: [
			User
		]
	})

	return sequelize
}
