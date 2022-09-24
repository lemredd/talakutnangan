import { Sequelize, SequelizeOptions } from "sequelize-typescript"

import type { SourceType } from "$/types/database"

import Role from "%/models/role"
import User from "%/models/user"
import Log from "$!/singletons/log"
import Signature from "%/models/signature"
import Department from "%/models/department"
import AuditTrail from "%/models/audit_trail"
import ChatMessage from "%/models/chat_message"
import Consultation from "%/models/consultation"
import AttachedRole from "%/models/attached_role"
import StudentDetail from "%/models/student_detail"
import ProfilePicture from "%/models/profile_picture"
import createConfiguration from "%/configuration/create"
import EmployeeSchedule from "%/models/employee_schedule"
import AttachedChatFile from "%/models/attached_chat_file"
import ChatMessageActivity from "%/models/chat_message_activity"

export default async function(type: SourceType): Promise<Sequelize> {
	const configuration: SequelizeOptions = createConfiguration(type) as SequelizeOptions
	const sequelize = new Sequelize({
		...configuration,
		"logging": (query: string) => {
			Log.trace("query", query)
		},
		"models": [
			Role,
			User,
			Signature,
			AuditTrail,
			Department,
			ChatMessage,
			Consultation,
			AttachedRole,
			StudentDetail,
			ProfilePicture,
			EmployeeSchedule,
			AttachedChatFile,
			ChatMessageActivity
		]
	})

	try {
		await sequelize.authenticate()
		Log.success("server", "Connected to the database server")
	} catch (error) {
		Log.errorMessage("server", "Cannot connect to the database")
		Log.error("server", error as Error)
	}

	return sequelize
}
