import { SourceType } from "$/types/database"

import Log from "!/helpers/log"
import Database from "%/data_source/database"
import Transport from "!/helpers/email/transport"
import RequestEnvironment from "$/helpers/request_environment"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default async function(sourceType: SourceType) {
	Log.initialize()

	Log.trace("app", "initialized logger")

	await Database.initialize(sourceType)

	Log.trace("app", "initialized database")

	if (
		process.env.EMAIL_HOST !== undefined
		&& process.env.EMAIL_PORT !== undefined
		&& process.env.EMAIL_USER !== undefined
		&& process.env.EMAIL_PASS !== undefined
	) {
		Transport.initialize(
			process.env.EMAIL_HOST,
			+process.env.EMAIL_PORT,
			process.env.EMAIL_USER,
			process.env.EMAIL_PASS
		)

		Log.trace("app", "initialized e-mail transport")
	} else {
		if (!RequestEnvironment.isOnTest) {
			console.error("Some e-mail variables are not defined");
			process.exit(1)
		}
	}

	CommonMiddlewareList.initialize()

	Log.trace("app", "initialized common middleware list")
}
