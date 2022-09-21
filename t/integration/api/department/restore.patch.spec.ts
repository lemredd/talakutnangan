import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import Model from "%/models/department"
import RoleFactory from "~/factories/role"
import Factory from "~/factories/department"
import RequestEnvironment from "$!/singletons/request_environment"
import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/department/restore.patch"

describe("PATCH /api/department", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory()
		.departmentFlags(permissionGroup.generateMask(...ARCHIVE_AND_RESTORE))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const model = await new Factory().insertOne()
		await model.destroy()

		const response = await App.request
		.patch("/api/department")
		.send({
			"data": [
				{
					"id": String(model.id),
					"type": "department"
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
