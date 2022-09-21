import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import { CREATE } from "$/permissions/role_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/role/create.post"

describe("POST /api/role", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory()
		.roleFlags(permissionGroup.generateMask(...CREATE))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const role = await new RoleFactory().makeOne()

		const response = await App.request
		.post("/api/role")
		.set("Cookie", cookie)
		.send({
			"data": {
				"type": "role",
				"attributes": {
					"name": role.name,
					"semesterFlags": role.semesterFlags,
					"tagFlags": role.tagFlags,
					"postFlags": role.postFlags,
					"commentFlags": role.commentFlags,
					"profanityFlags": role.profanityFlags,
					"userFlags": role.userFlags,
					"auditTrailFlags": role.auditTrailFlags
				}
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data.attributes.name).toBe(role.name)
	})
})
