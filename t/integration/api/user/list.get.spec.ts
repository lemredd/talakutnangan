import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import UserFactory from "~/factories/user"
import Route from "!/app/routes/api/user/list.get"

describe("GET /api/user/list", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get single complete user", async () => {
		const { user: admin, cookie } = await App.makeAuthenticatedCookie()
		const student = await ((new UserFactory()).beStudent()).insertOne()

		const response = await App.request
			.get("/api/user/list")
			.query({ criteria: "complete" })
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toHaveProperty("data.0.attributes.email", admin.email)
		expect(response.body).toHaveProperty("data.1.attributes.email", student.email)
	})

	it.todo("can be accessed by permitted user and get multiple complete users")
	it.todo("cannot be accessed by guest users")
})
