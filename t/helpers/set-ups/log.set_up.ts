import "dotenv/config"
import consola from "consola"

import { Environment } from "$/types/server"
import Log from "$!/singletons/log"
import RequestEnvironment from "$/singletons/request_environment"

beforeAll(() => {
	consola.wrapAll()
	if (RequestEnvironment.environment === Environment.UnitTest) {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		consola.mockTypes(() => () => {})
	}

	Log.initialize()
})
