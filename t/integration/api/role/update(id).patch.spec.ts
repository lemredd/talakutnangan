import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import { UPDATE } from "$/permissions/role_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/role/update(id).patch"

describe("PATCH /api/role/:id", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory()
		.roleFlags(permissionGroup.generateMask(...UPDATE))
		.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const role = await new RoleFactory().insertOne()
		const newRole = await new RoleFactory().makeOne()

		const response = await App.request
		.patch(`/api/role/${role.id}`)
		.set("Cookie", cookie)
		.send({
			"data": {
				"type": "role",
				"id": String(role.id),
				"attributes": {
					"name": newRole.name,
					"semesterFlags": newRole.semesterFlags,
					"tagFlags": newRole.tagFlags,
					"postFlags": newRole.postFlags,
					"commentFlags": newRole.commentFlags,
					"profanityFlags": newRole.profanityFlags,
					"userFlags": newRole.userFlags,
					"auditTrailFlags": newRole.auditTrailFlags
				}
			},
			"meta": {
				"password": user.password
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})
})
