import { JSON_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import App from "~/set-ups/app"

import Route from "!%/api/user/log_out.post"

describe("POST /api/user/log_out", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can log out", async() => {
		const { cookie } = await App.makeAuthenticatedCookie()

		const response = await App.request
		.post("/api/user/log_out")
		.set("Cookie", cookie)
		.type(JSON_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})
})
