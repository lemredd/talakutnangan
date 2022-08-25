import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"

import Socket from "!/ws/socket"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import Factory from "~/factories/chat_message"
import ConsultationFactory from "~/factories/consultation"
import RequestEnvironment from "$!/singletons/request_environment"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Route from "!%/api/chat_message/create.post"

describe("POST /api/chat_message", () => {
	jest.mock("!/ws/socket")
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const consultation = await new ConsultationFactory().insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(user))
		.consultation(() => Promise.resolve(consultation))
		.serializedOne()

		const response = await App.request
		.post("/api/chat_message")
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"data": model.data.attributes.data
				},
				"relationships": {
					"consultation": {
						"data": {
							"id": String(consultation.id),
							"type": "consultation"
						}
					},
					"user": {
						"data": {
							"id": String(user.id),
							"type": "user"
						}
					}
				},
				"type": "chat_message"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data.attributes.data).toStrictEqual(model.data.attributes.data)
		const previousCalls = Socket.consumePreviousCalls()
		expect(previousCalls[0].functionName).toBe("emitToClients")
		expect(previousCalls[0].arguments).toHaveProperty("eventName", "create")
		expect(previousCalls[0].arguments).toHaveProperty(
			"namespace",
			makeConsultationChatNamespace(String(consultation.id))
		)
		expect(previousCalls[0].arguments).toHaveProperty(
			"data.0.data.attributes.data",
			model.data.attributes.data
		)
	})
})
