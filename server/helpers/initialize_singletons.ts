import { SourceType } from "$/types/database"

import Log from "$!/singletons/log"
import Database from "%/data_source/database"
import URLMaker from "$!/singletons/url_maker"
import Transport from "!/singletons/transport"
import CacheManager from "$!/singletons/cache_manager"
import RequestEnvironment from "$/singletons/request_environment"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default async function(sourceType: SourceType) {
	Log.initialize()

	Log.trace("app", "initialized logger")

	CacheManager.initialize()

	Log.trace("app", "initialized cache manager")

	const protocol = process.env.WEB_PROTOCOL || "http"
	const hostname = process.env.WEB_HOST || "localhost"
	const port = parseInt(process.env.WEB_PORT || process.env.PORT || "80", 10)
	const basePath = process.env.WEB_BASE_PATH || "/"
	URLMaker.initialize(protocol, hostname, port, basePath)

	Log.trace("app", "initialized URL maker")

	await Database.initialize(sourceType)

	Log.trace("app", "initialized database")

	if (
		typeof process.env.EMAIL_HOST !== "undefined"
		&& typeof process.env.EMAIL_PORT !== "undefined"
		&& typeof process.env.EMAIL_USER !== "undefined"
		&& typeof process.env.EMAIL_PASS !== "undefined"
	) {
		Transport.initialize(
			process.env.EMAIL_HOST,
			Number(process.env.EMAIL_PORT),
			process.env.EMAIL_USER,
			process.env.EMAIL_PASS
		)

		Log.trace("app", "initialized e-mail transport")
	} else if (!RequestEnvironment.isOnTest) {
		console.error("Some e-mail variables are not defined")
		process.exit(1)
	}

	CommonMiddlewareList.initialize()

	Log.trace("app", "initialized common middleware list")
}
