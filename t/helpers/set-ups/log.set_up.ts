import "dotenv/config"
import consola from "consola"

import { Environment } from "$/types/server"
import Log from "!/helpers/log"
import RequestEnvironment from "$/helpers/request_environment"

beforeAll(() => {
	consola.wrapAll()
	if (RequestEnvironment.environment === Environment.IntegrationTest) {
		consola.mockTypes(() => () => {})
		Log.initialize()
	}
})
