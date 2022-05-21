import makeGetCreateRoute from "./create.get"
import { Request, Response } from "~/mock_types"
import Database from "~/database"
import User from "!/models/user"

describe("GET /api/user/create", () => {
	it("can create user", async () => {
		const manager = Database.manager
		const getCreateRoute = makeGetCreateRoute(manager)

		const request = new Request()
		const response = new Response()
		await getCreateRoute(request, response)

		const users = await manager.find(User)
		expect(users).toHaveLength(1)
	})
})
