import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import Factory from "~/factories/user"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"
import RequestEnvironment from "$!/singletons/request_environment"

import { user as permissionGroup } from "$/permissions/permission_list"
import { UPDATE_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import Route from "!%/api/user(id)/relationships/department/update.patch"

describe("PATCH /api/user/:id/relationships/department", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can update department", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...UPDATE_ANYONE_ON_ALL_DEPARTMENTS))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const department = await new DepartmentFactory().insertOne()
		const model = await new Factory().insertOne()

		const response = await App.request
		.patch(`/api/user/${model.id}/relationships/department`)
		.send({
			"data": {
				"id": String(department.id),
				"type": "department"
			}
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})
})
