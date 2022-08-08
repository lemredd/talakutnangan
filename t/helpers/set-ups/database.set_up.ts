import "reflect-metadata"
import Database from "./database"

export default function() {
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
