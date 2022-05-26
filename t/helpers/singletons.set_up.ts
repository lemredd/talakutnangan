import Database from "~/database"
import RequestEnvironment from "!/helpers/request_environment"
import initializeSingletons from "!/helpers/initialize_singletons"

beforeAll(() => {
	initializeSingletons(Database.manager)
});

afterAll(() => {
	RequestEnvironment.destroy()
});
