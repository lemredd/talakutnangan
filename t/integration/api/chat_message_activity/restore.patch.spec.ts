import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import Model from "%/models/chat_message_activity"
import Factory from "~/factories/chat_message_activity"
import RequestEnvironment from "$!/singletons/request_environment"

import Route from "!%/api/chat_message_activity/restore.patch"

describe("PATCH /api/chat_message_activity", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const role = await new RoleFactory().insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(role, user => user.beReachableEmployee())
		const model = await new Factory().insertOne()
		await model.destroy()

		const response = await App.request
		.patch("/api/chat_message_activity")
		.send({
			"data": [
				{
					"id": String(model.id),
					"type": "chat_message_activity"
				}
			]
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		const targetModel = await Model.findByPk(model.id) as Model
		expect(targetModel.deletedAt).toBeNull()
	})
})
