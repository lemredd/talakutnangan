import "dotenv/config"
import consola from "consola"
import { Environment } from "$/types/server"
import getDataSourceType from "~/set-ups/get_data_source_type"
import RequestEnvironment from "$/singletons/request_environment"
import initializeSingletons from "!/helpers/initialize_singletons"

beforeAll(async() => {
	if (RequestEnvironment.environment === Environment.UnitTest) {
		consola.wrapAll()
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		consola.mockTypes(() => () => {})
	}

	await initializeSingletons(getDataSourceType())
}, 10000)
