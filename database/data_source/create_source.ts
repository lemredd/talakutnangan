import { Sequelize, SequelizeOptions } from "sequelize-typescript"

import type { SourceType } from "$/types/database"

import Log from "$!/singletons/log"
import Role from "%/models/role"
import User from "%/models/user"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import createConfiguration from "%/configuration/create"
import EmployeeSchedule from "%/models/employee_schedule"

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
			Department,
			AttachedRole,
			StudentDetail,
			EmployeeSchedule
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
