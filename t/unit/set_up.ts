import "reflect-metadata"
import Database from "./database"

beforeAll(async () => {
	await Database.create()
});

afterAll(async () => {
	await Database.destroy()
});

afterEach(async () => {
	await Database.clear()
});
