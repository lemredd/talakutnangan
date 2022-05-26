import Database from "~/database"
import RequestEnvironment from "!/helpers/request_environment"
import initializeSingletons from "!/helpers/initialize_singletons"

beforeEach(() => {
	initializeSingletons(Database.manager)
});

afterEach(() => {
	RequestEnvironment.destroy()
});
