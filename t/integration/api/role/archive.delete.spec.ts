import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import Role from "%/models/role"
import RoleFactory from "~/factories/role"
import RequestEnvironment from "$!/singletons/request_environment"
import { ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/role/archive.delete"

describe("DELETE /api/role", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const adminRole = await new RoleFactory()
			.roleFlags(permissionGroup.generateMask(...ARCHIVE_AND_RESTORE))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const role = await (new RoleFactory()).insertOne()

		const response = await App.request
			.delete("/api/role")
			.send({
				data: [
					{ type: "role", id: String(role.id) }
				]
			})
			.set("Cookie", cookie)
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		expect(await Role.findOne({ where: { id: role.id } })).toBeNull()
	})
})
