import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"

import RoleFactory from "~/factories/role"
import ConsultationFactory from "~/factories/consultation"
import RequestEnvironment from "$!/singletons/request_environment"
import Factory from "~/factories/chat_message_activity"

import Route from "!%/api/chat_message_activity/list.get"

describe("GET /api/chat_message_activity", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { "user": employee, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const consultation = await new ConsultationFactory().insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(employee))
		.consultation(() => Promise.resolve(consultation))
		.insertOne()

		const response = await App.request
		.get("/api/chat_message_activity")
		.set("Cookie", cookie)
		.query({
			"filter": {
				"consultationIDs": String(consultation.id),
				"existence": "present"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		console.log(response.body)
		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.id", model.id)
		expect(response.body).not.toHaveProperty("data.1")
	})
})
