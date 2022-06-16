import { SourceType } from "%/types/independent"
import { Environment } from "!/types/independent"
import getEnvironment from "!/helpers/get_environment"
import initializeSingletons from "!/helpers/initialize_singletons"

beforeAll(() => {
	if (getEnvironment() === Environment.UnitTest) {
		initializeSingletons("unit_test")
	} else {
		initializeSingletons(process.env.DATABASE_TYPE as SourceType)
	}
});
