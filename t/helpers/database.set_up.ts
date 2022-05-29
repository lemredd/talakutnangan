import "reflect-metadata"
import Database from "./database"

beforeAll(async () => {
	await Database.create()
	console.log("created the database")
});

afterAll(async () => {
	await Database.destroy()
});

afterEach(async () => {
	await Database.clear()
});
