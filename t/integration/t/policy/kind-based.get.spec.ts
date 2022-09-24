import { JSON_API_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import App from "~/setups/app"
import UserFactory from "~/factories/user"

import Route from "!%/t/policy/kind-based.get"

describe("GET /t/policy/kind-based", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie(
			null,
			(factory: UserFactory) => {
				return factory.beStudent()
			}
		)

		const response = await App.request
			.get("/t/policy/kind-based")
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
	})

	it("cannot be accessed by unpermitted user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie(
			null,
			(factory: UserFactory) => {
				return factory.beReachableEmployee()
			}
		)

		const response = await App.request
			.get("/t/policy/kind-based")
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})

	it("cannot be accessed by guest user", async () => {
		const response = await App.request
			.get("/t/policy/kind-based")
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})
})
