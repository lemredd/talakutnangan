import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import Consultation from "%/models/consultation"
import Model from "%/models/chat_message_activity"
import Factory from "~/factories/chat_message_activity"
import ConsultationFactory from "~/factories/consultation"
import AttachedRoleFactory from "~/factories/attached_role"
import StudentDetailFactory from "~/factories/student_detail"
import RequestEnvironment from "$!/singletons/request_environment"

import Route from "!%/api/chat_message_activity/archive.delete"

describe("DELETE /api/chat_message_activity", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be archived by consulter", async() => {
		const role = await new RoleFactory().insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(role, user => user.beReachableEmployee())
		const model = await new Factory().insertOne()

		const response = await App.request
		.delete("/api/chat_message_activity")
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
		const targetModel = await Model.findByPk(model.id)
		expect(targetModel).toBeNull()
		expect(await Consultation.count()).toBe(1)
	})

	it("can be archived by the consultant", async() => {
		const role = await new RoleFactory().insertOne()
		const { "user": consultant, cookie } = await App.makeAuthenticatedCookie(
			role,
			user => user.beReachableEmployee()
		)
		const consultantInfo = new AttachedRoleFactory()
		.user(() => Promise.resolve(consultant))
		.insertOne()
		const consultation = new ConsultationFactory()
		.consultantInfo(() => consultantInfo)
		.insertOne()
		const model = await new Factory().consultation(() => consultation).insertOne()
		await new StudentDetailFactory().user(() => Promise.resolve(consultant)).insertOne()

		const response = await App.request
		.delete("/api/chat_message_activity")
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
		const targetModel = await Model.findByPk(model.id)
		expect(targetModel).toBeNull()
		expect(await Consultation.count()).toBe(0)
	})
})
