import "reflect-metadata"
import RequestEnvironment from "$/helpers/request_environment"
import Database from "./database"

export default function setUpDatabase() {
	beforeAll((done) => {
		Database.create().then(done)
	})

	afterAll((done) => {
		Database.destroy().then(done)
	});

	afterEach((done) => {
		Database.clear().then(done)
	})
}

if (RequestEnvironment.isOnIntegration) {
	setUpDatabase()
}
