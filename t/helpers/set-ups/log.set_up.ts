import "dotenv/config"
import consola from "consola"

import { Environment } from "$/types/server"
import Log from "$!/singletons/log"
import RequestEnvironment from "$/helpers/request_environment"

beforeAll(() => {
	consola.wrapAll()
	if (RequestEnvironment.environment === Environment.UnitTest) {
		consola.mockTypes(() => () => {})
		Log.initialize()
	}
})
