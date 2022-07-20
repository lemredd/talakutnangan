import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import Role from "%/models/role"
import RoleFactory from "~/factories/role"
import RequestEnvironment from "$!/singletons/request_environment"
import { ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!/app/routes/api/role/archive(id).delete"

describe("DELETE /api/role/archive/:id", () => {
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
			.delete(`/api/role/archive/${role.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
		expect(response.body).toStrictEqual({})
		expect(await Role.findOne({ where: { id: role.id } })).toBeNull()
	})

	it.todo("cannot delete non-existing")
	it.todo("cannot redelete")

	it("cannot be accessed without correct permission", async () => {
		const { user: admin, cookie } = await App.makeAuthenticatedCookie()
		const role = await (new RoleFactory()).insertOne()

		const response = await App.request
			.delete(`/api/role/archive/${role.id}`)
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})

	it("cannot be accessed by guest users", async () => {
		const role = await (new RoleFactory()).insertOne()

		const response = await App.request
			.delete(`/api/role/archive/${role.id}`)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})
})
