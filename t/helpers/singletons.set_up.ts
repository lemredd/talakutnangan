import { SourceType } from "%/types/independent"
import { Environment } from "$/types/independent"
import getEnvironment from "!/helpers/get_environment"
import initializeSingletons from "!/helpers/initialize_singletons"

beforeAll(async () => {
	if (getEnvironment() === Environment.UnitTest) {
		await initializeSingletons("unit_test")
	} else {
		await initializeSingletons(process.env.DATABASE_TYPE as SourceType)
	}
});
