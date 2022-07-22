import { JSON_API_MEDIA_TYPE } from "$/types/server"

import RequestEnvironment from "$!/singletons/request_environment"
import App from "~/set-ups/app"
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
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("token")
	})

	it("can be accessed by guest and request with non-existing credentials", async () => {
		const response = await App.request
			.post("/api/user/log_in")
			.send({
				email: "sample@gmail.com",
				password: "12345678"
			})
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		// TODO: Output the validation error in better format
		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
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
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
		expect(response.body).toHaveProperty("errors")
	})
})
