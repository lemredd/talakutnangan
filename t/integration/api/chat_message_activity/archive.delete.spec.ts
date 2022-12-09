import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import Consultation from "%/models/consultation"
import Model from "%/models/chat_message_activity"
import SignatureFactory from "~/factories/signature"
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

	it("can be archived by consultee", async() => {
		const role = await new RoleFactory().insertOne()
		const { "user": consultee, cookie } = await App.makeAuthenticatedCookie(
			role,
			user => user.beStudent()
		)
		const model = await new Factory().insertOne()
		await new StudentDetailFactory().user(() => Promise.resolve(consultee)).insertOne()
		await new SignatureFactory()
		.user(() => Promise.resolve(consultee))
		.insertOne()

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

	it("can be archived by the consultor", async() => {
		const role = await new RoleFactory().insertOne()
		const { "user": consultor, cookie } = await App.makeAuthenticatedCookie(
			role,
			user => user.beReachableEmployee()
		)
		const consultorInfo = new AttachedRoleFactory()
		.user(() => Promise.resolve(consultor))
		.insertOne()
		const consultation = new ConsultationFactory()
		.consultorInfo(() => consultorInfo)
		.insertOne()
		const model = await new Factory().consultation(() => consultation).insertOne()
		await new SignatureFactory()
		.user(() => Promise.resolve(consultor))
		.insertOne()

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
