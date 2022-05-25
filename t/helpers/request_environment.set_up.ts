import Database from "~/database"
import RequestEnvironment from "!/helpers/request_environment"

beforeEach(() => {
	RequestEnvironment.intialize(Database.manager)
});

afterEach(() => {
	RequestEnvironment.destroy()
});
