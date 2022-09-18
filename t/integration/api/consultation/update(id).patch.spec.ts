import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"

import Socket from "!/ws/socket"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import Factory from "~/factories/consultation"
import AttachedRole from "%/models/attached_role"
import RequestEnvironment from "$!/singletons/request_environment"
import makeConsultationNamespace from "$/namespace_makers/consultation"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Route from "!%/api/consultation/update(id).patch"

describe("PATCH /api/consultation/:id", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		jest.useRealTimers()
		const normalRole = await new RoleFactory().insertOne()
		const { "user": consultant, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const consultantInfo = await AttachedRole.findOne({
			"where": {
				"roleID": normalRole.id,
				"userID": consultant.id
			}
		}) as AttachedRole
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(consultantInfo))
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const newModel = await new Factory()
		.consultantInfo(() => Promise.resolve(consultantInfo))
		.startedAt(() => null)
		.finishedAt(() => null)
		.makeOne()
		await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(consultant))
		.consultation(() => Promise.resolve(model))
		.insertOne()

		const response = await App.request
		.patch(`/api/consultation/${model.id}`)
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"actionTaken": model.actionTaken,
					"attachedRoleID": model.attachedRoleID,
					"finishedAt": model.finishedAt,
					"reason": newModel.reason,
					"scheduledStartAt": model.scheduledStartAt.toJSON(),
					"startedAt": model.startedAt
				},
				"id": String(model.id),
				"relationships": {
					"consultant": {
						"data": {
							"id": String(consultant.id),
							"type": "user"
						}
					}
				},
				"type": "consultation"
			},
			"meta": {
				"doesAllowConflicts": true
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		const previousCalls = Socket.consumePreviousCalls()
		expect(previousCalls[0].functionName).toBe("emitToClients")
		expect(previousCalls[0].arguments).toHaveProperty("eventName", "update")
		expect(previousCalls[0].arguments).toHaveProperty(
			"namespace",
			makeConsultationNamespace(String(model.id))
		)
		expect(previousCalls[0].arguments).toHaveProperty(
			"data.0.data.attributes.reason",
			newModel.reason
		)
	})

	it("can be accessed by authenticated user with updated started time", async() => {
		jest.useRealTimers()
		const normalRole = await new RoleFactory().insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beStudent())
		const consultant = await new UserFactory()
		.beReachableEmployee()
		.insertOne()
		const consultantInfo = await AttachedRole.findOne({
			"where": {
				"roleID": normalRole.id,
				"userID": consultant.id
			}
		}) as AttachedRole
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(consultantInfo))
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const chatMessageActivityModel = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(consultant))
		.consultation(() => Promise.resolve(model))
		.insertOne()
		const newModel = await new Factory()
		.consultantInfo(() => Promise.resolve(consultantInfo))
		.startedAt(() => new Date())
		.finishedAt(() => null)
		.makeOne()

		const response = await App.request
		.patch(`/api/consultation/${model.id}`)
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"actionTaken": model.actionTaken,
					"attachedRoleID": model.attachedRoleID,
					"finishedAt": model.finishedAt,
					"reason": model.reason,
					"scheduledStartAt": model.scheduledStartAt.toJSON(),
					"startedAt": newModel.startedAt
				},
				"id": String(model.id),
				"relationships": {
					"consultant": {
						"data": {
							"id": String(consultant.id),
							"type": "user"
						}
					}
				},
				"type": "consultation"
			},
			"meta": {
				"doesAllowConflicts": true
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		const previousCalls = Socket.consumePreviousCalls()
		expect(previousCalls[0].functionName).toBe("emitToClients")
		expect(previousCalls[0].arguments).toHaveProperty("eventName", "update")
		expect(previousCalls[0].arguments).toHaveProperty(
			"namespace",
			makeConsultationNamespace(String(model.id))
		)
		expect(previousCalls[0].arguments).toHaveProperty(
			"data.0.data.attributes.startedAt",
			newModel.startedAt
		)
		expect(previousCalls[1].functionName).toBe("emitToClients")
		expect(previousCalls[1].arguments).toHaveProperty("eventName", "create")
		expect(previousCalls[1].arguments).toHaveProperty(
			"namespace",
			makeConsultationChatNamespace(String(chatMessageActivityModel.id))
		)
		expect(previousCalls[0].arguments).toHaveProperty(
			"data.0.data.attributes.kind",
			"status"
		)
	})

	it("can be accessed by authenticated user with updated finished time", async() => {
		jest.useRealTimers()
		const STARTED_TIME = new Date()
		const normalRole = await new RoleFactory().insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beStudent())
		const consultant = await new UserFactory()
		.beReachableEmployee()
		.insertOne()
		const consultantInfo = await AttachedRole.findOne({
			"where": {
				"roleID": normalRole.id,
				"userID": consultant.id
			}
		}) as AttachedRole
		const model = await new Factory()
		.consultantInfo(() => Promise.resolve(consultantInfo))
		.startedAt(() => STARTED_TIME)
		.finishedAt(() => null)
		.insertOne()
		const chatMessageActivityModel = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(consultant))
		.consultation(() => Promise.resolve(model))
		.insertOne()
		const newModel = await new Factory()
		.consultantInfo(() => Promise.resolve(consultantInfo))
		.startedAt(() => STARTED_TIME)
		.finishedAt(() => new Date())
		.makeOne()

		const response = await App.request
		.patch(`/api/consultation/${model.id}`)
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"actionTaken": model.actionTaken,
					"attachedRoleID": model.attachedRoleID,
					"finishedAt": newModel.finishedAt,
					"reason": model.reason,
					"scheduledStartAt": model.scheduledStartAt.toJSON(),
					"startedAt": model.startedAt
				},
				"id": String(model.id),
				"relationships": {
					"consultant": {
						"data": {
							"id": String(consultant.id),
							"type": "user"
						}
					}
				},
				"type": "consultation"
			},
			"meta": {
				"doesAllowConflicts": true
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		const previousCalls = Socket.consumePreviousCalls()
		expect(previousCalls[0].functionName).toBe("emitToClients")
		expect(previousCalls[0].arguments).toHaveProperty("eventName", "update")
		expect(previousCalls[0].arguments).toHaveProperty(
			"namespace",
			makeConsultationNamespace(String(model.id))
		)
		expect(previousCalls[0].arguments).toHaveProperty(
			"data.0.data.attributes.finishedAt",
			newModel.finishedAt
		)
		expect(previousCalls[1].functionName).toBe("emitToClients")
		expect(previousCalls[1].arguments).toHaveProperty("eventName", "create")
		expect(previousCalls[1].arguments).toHaveProperty(
			"namespace",
			makeConsultationChatNamespace(String(chatMessageActivityModel.id))
		)
		expect(previousCalls[0].arguments).toHaveProperty(
			"data.0.data.attributes.kind",
			"status"
		)
	})
})
