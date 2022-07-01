import RequestEnvironment from "!/helpers/request_environment"

import App from "~/set-ups/app"

import Route from "!/app/routes/t/authorization_error.get"

describe("GET /t/authorization_error", () => {
	beforeAll(async () => {
		await App.create(new Route(), false)
	})

	it("should output error properly", async () => {
		const response = await App.request
			.get("/t/authorization_error")
			.accept("application/vnd.api+json")

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
		expect(response.body).toHaveProperty("errors")
		expect(response.body).toStrictEqual({
			errors: [
				{
					status: RequestEnvironment.status.UNAUTHORIZED,
					code: "1",
					title: "Authorization Error",
					detail: "Sample authorization error"
				}
			]
		})
	})
})
