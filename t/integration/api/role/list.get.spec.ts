import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import Route from "!/app/routes/api/role/list.get"

describe("GET /api/role/list", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and multiple roles", async () => {
		const { user: admin, cookie } = await App.makeAuthenticatedCookie()
		const roles = await (new RoleFactory()).insertMany(3)

		const response = await App.request
			.get("/api/role/list")
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toHaveProperty("data.0.attributes.name", roles[0].name)
		expect(response.body).toHaveProperty("data.1.attributes.name", roles[1].name)
		expect(response.body).toHaveProperty("data.2.attributes.name", roles[2].name)
	})

	it.todo("cannot be accessed by guest users")
})
