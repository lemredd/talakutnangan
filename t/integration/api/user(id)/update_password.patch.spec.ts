import { JSON_API_MEDIA_TYPE } from "$/types/server"
import RequestEnvironment from "$!/singletons/request_environment"

import "~/setups/email.setup"
import App from "~/setups/app"
import RoleFactory from "~/factories/role"

import { UPDATE_OWN_DATA } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/user(id)/update_password.patch"

describe("PATCH /api/user/:id/update_password", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can update password", async() => {
		const studentRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...UPDATE_OWN_DATA))
		.insertOne()

		const { "user": student, cookie } = await App.makeAuthenticatedCookie(studentRole)

		const response = await App.request
		.patch(`/api/user/${student.id}/update_password`)
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"password": "12345678"
				},
				"id": String(student.id),
				"type": "user"
			},
			"meta": {
				"confirmPassword": "12345678",
				"currentPassword": "password"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})
})
