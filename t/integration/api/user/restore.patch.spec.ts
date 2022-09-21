import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import RoleFactory from "~/factories/role"
import User from "%/models/user"
import UserFactory from "~/factories/user"
import RequestEnvironment from "$!/singletons/request_environment"
import { user as permissionGroup } from "$/permissions/permission_list"
import { ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT } from "$/permissions/user_combinations"

import Route from "!%/api/user/restore.patch"

describe("PATCH /api/user", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const adminRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT))
			.insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const user = await (new UserFactory()).insertOne()
		await user.destroy()

		const response = await App.request
			.patch("/api/user")
			.send({
				data: [
					{ type: "user", id: String(user.id) }
				]
			})
			.set("Cookie", cookie)
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		expect((await User.findOne({ where: { id: user.id } }))!.deletedAt).toBeNull()
	})
})
