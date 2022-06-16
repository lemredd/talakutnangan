import { StatusCodes } from "http-status-codes"

import App from "~/app"
import UserFactory from "~/factories/user"
import Route from "!/app/routes/api/user/log_in.post"

describe("POST /api/user/log_in", () => {
	beforeAll(async () => {
		await App.create(new Route(), false)
	})

	it("can be accessed by guest and request with existing credentials", async () => {
		const user = await (new UserFactory()).insertOne()

		const response = await App.request
			.post("/api/user/log_in")
			.send({
				email: user.email,
				password: user.password
			})

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toHaveProperty("token")
	})

	it("can be accessed by guest and request with non-existing credentials", async () => {
		const response = await App.request
			.post("/api/user/log_in")
			.send({
				email: "sample@gmail.com",
				password: "12345678"
			})

		expect(response.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
	})

	it("cannot be accessed by authenticated users", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const response = await App.request
			.post("/api/user/log_in")
			.set("Cookie", cookie)
			.send({
				email: user.email,
				password: user.password
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
		expect(response.body).toHaveProperty("errors")
	})
})
