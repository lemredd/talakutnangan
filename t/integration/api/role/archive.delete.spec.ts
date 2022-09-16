import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import Model from "%/models/role"
import Factory from "~/factories/role"
import UserFactory from "~/factories/user"
import RequestEnvironment from "$!/singletons/request_environment"
import { ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/role/archive.delete"

describe("DELETE /api/role", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new Factory()
		.roleFlags(permissionGroup.generateMask(...ARCHIVE_AND_RESTORE))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const model = await new Factory().insertOne()
		const otherModel = await new Factory().insertOne()
		await new UserFactory().attach(model).attach(otherModel).insertOne()

		const response = await App.request
		.delete("/api/role")
		.send({
			"data": [
				{
					"id": String(model.id),
					"type": "role"
				}
			]
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		expect(await Model.findOne({ "where": { "id": model.id } })).toBeNull()
	})
})
