import "reflect-metadata"
import DatabaseHelper from "./database_helper"

beforeAll(async () => {
	const helper = new DatabaseHelper();
	await helper.create()
});

afterAll(async () => {
	const helper = new DatabaseHelper();
	await helper.destroy()
});

afterEach(async () => {
	const helper = new DatabaseHelper();
	await helper.clear()
});
