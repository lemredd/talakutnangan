import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"

import Socket from "!/ws/socket"
import RoleFactory from "~/factories/role"
import Factory from "~/factories/chat_message"
import RequestEnvironment from "$!/singletons/request_environment"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"

import Route from "!%/api/chat_message/create_with_file.post"

describe("POST /api/chat_message/create_with_file", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beReachableEmployee())
		const chatMessageActivity = await new ChatMessageActivityFactory().insertOne()
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(chatMessageActivity))
		.serializedOne()
		const path = `${RequestEnvironment.root}/t/data/valid_student_details.csv`

		const response = await App.request
		.post("/api/chat_message/create_with_file")
		.set("Cookie", cookie)
		.field("data[type]", "chat_message")
		.field("data[attributes][kind]", model.data.attributes.kind)
		.field("data[attributes][data]", model.data.attributes.data)
		.field("data[relationships][chatMessageActivity][data][type]", "chat_message_activity")
		.field("data[relationships][chatMessageActivity][data][id]", String(chatMessageActivity.id))
		.attach("meta[fileContents]", path)
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
		expect(previousCalls[0].arguments).toHaveProperty(
			"included.0.data.type",
			"attached_file"
		)
	})
})
