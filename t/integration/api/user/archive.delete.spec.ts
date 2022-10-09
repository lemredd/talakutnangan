import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import User from "%/models/user"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import RequestEnvironment from "$!/singletons/request_environment"
import { user as permissionGroup } from "$/permissions/permission_list"
import { ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT } from "$/permissions/user_combinations"

import Route from "!%/api/user/archive.delete"

describe("DELETE /api/user", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(adminRole)
		const user = await new UserFactory().insertOne()

		const response = await App.request
		.delete("/api/user")
		.send({
			"data": [
				{
					"id": String(user.id),
					"type": "user"
				}
			]
		})
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		expect(await User.findOne({ "where": { "id": user.id } })).toBeNull()
	})
})
