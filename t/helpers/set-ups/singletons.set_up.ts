import "dotenv/config"
import consola from "consola"
import { Environment } from "$/types/server"
import getDataSourceType from "~/set-ups/get_data_source_type"
import RequestEnvironment from "!/helpers/request_environment"
import initializeSingletons from "!/helpers/initialize_singletons"

beforeAll(async () => {
	if (RequestEnvironment.environment === Environment.UnitTest) {
		consola.wrapAll()
		consola.mockTypes(() => jest.fn())
	}

	await initializeSingletons(getDataSourceType())
})

beforeEach(() => {
	if (RequestEnvironment.environment === Environment.UnitTest) {
		consola.mockTypes(() => jest.fn())
	}
})
