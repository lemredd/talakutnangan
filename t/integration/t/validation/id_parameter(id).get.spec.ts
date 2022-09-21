import { JSON_API_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import App from "~/setups/app"
import UserFactory from "~/factories/user"

import Route from "!%/t/validation/id_parameter(id).get"

describe("GET /t/validation/id_parameter/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can validate if ID is present", async () => {
		const user = await new UserFactory().insertOne()

		const response = await App.request
			.get(`/t/validation/id_parameter/${user.id}`)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
	})

	it("cannot validate if ID is not numeric", async () => {
		const response = await App.request
			.get("/t/validation/id_parameter/sample")
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
	})

	it("cannot validate if ID is absent", async () => {
		const response = await App.request
			.get("/t/validation/id_parameter/2")
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.BAD_REQUEST)
	})
})
