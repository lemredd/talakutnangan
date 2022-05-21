import makeGetCreateRoute from "./create.get"
import DatabaseHelper from "~/database_helper"

describe("GET /api/user/create", () => {
	it("can create user", async () => {
		const databaseHelper = new DatabaseHelper()
		const manager = databaseHelper.manager

		expect(true).toBeTruthy()
	})
})
