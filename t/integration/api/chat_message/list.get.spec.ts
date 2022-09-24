import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"

import RoleFactory from "~/factories/role"
import Factory from "~/factories/chat_message"
import ConsultationFactory from "~/factories/consultation"
import RequestEnvironment from "$!/singletons/request_environment"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import Route from "!%/api/chat_message/list.get"

describe("GET /api/chat_message", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { "user": employee, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const consultation = await new ConsultationFactory().insertOne()
		const activity = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(employee))
		.consultation(() => Promise.resolve(consultation))
		.insertOne()
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(activity))
		.insertOne()

		const response = await App.request
		.get("/api/chat_message")
		.set("Cookie", cookie)
		.query({
			"filter": {
				"consultationIDs": String(consultation.id),
				"existence": "exists"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.id", String(model.id))
		expect(response.body).toHaveProperty("data.0.type", "chat_message")
		expect(response.body).toHaveProperty("data.0.attributes.kind", model.kind)
		expect(response.body).not.toHaveProperty("data.1")
	})

	it("can be accessed by authenticated user forto get preview messages", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { "user": employee, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const consultation = await new ConsultationFactory().insertOne()
		const activity = await new ChatMessageActivityFactory()
		.user(() => Promise.resolve(employee))
		.consultation(() => Promise.resolve(consultation))
		.insertOne()
		await new Factory()
		.chatMessageActivity(() => Promise.resolve(activity))
		.insertOne()
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(activity))
		.insertOne()

		const response = await App.request
		.get("/api/chat_message")
		.set("Cookie", cookie)
		.query({
			"filter": {
				"consultationIDs": String(consultation.id),
				"previewMessageOnly": true
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.id", String(model.id))
		expect(response.body).toHaveProperty("data.0.type", "chat_message")
		expect(response.body).toHaveProperty("data.0.attributes.kind", model.kind)
		expect(response.body).not.toHaveProperty("data.1")
	})
})
