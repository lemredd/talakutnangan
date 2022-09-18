import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"

import Socket from "!/ws/socket"
import RoleFactory from "~/factories/role"
import Factory from "~/factories/consultation"
import RequestEnvironment from "$!/singletons/request_environment"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Route from "!%/api/consultation/create.post"

describe("POST /api/consultation", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const model = await new Factory()
		.startedAt(() => null)
		.finishedAt(() => null)
		.makeOne()

		const response = await App.request
		.post("/api/consultation")
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"actionTaken": model.actionTaken,
					"attachedRoleID": model.attachedRoleID,
					"finishedAt": model.finishedAt,
					"reason": model.reason,
					"scheduledStartAt": model.scheduledStartAt.toJSON()
				},
				"relationships": {
					"consultant": {
						"data": {
							"id": String(user.id),
							"type": "user"
						}
					},
					"consultantRole": {
						"data": {
							"id": String(normalRole),
							"type": "role"
						}
					},
					"participants": {
						"data": [
							{
								"id": String(user.id),
								"type": "user"
							}
						]
					}
				},
				"type": "consultation"
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
			makeConsultationChatNamespace(String(chatMessageActivity.consultationID))
		)
		expect(previousCalls[0].arguments).toHaveProperty(
			"data.0.data.attributes.data",
			model.data.attributes.data
		)
	})
})
