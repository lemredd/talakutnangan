import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import { UPDATE } from "$/permissions/role_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!/app/routes/api/role/update.put"

describe("PUT /api/role/update", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const adminRole = await new RoleFactory()
			.roleFlags(permissionGroup.generateMask(...UPDATE))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const role = await (new RoleFactory()).insertOne()
		const newRoleDetails = await (new RoleFactory()).makeOne()

		const response = await App.request
			.put("/api/role/update")
			.set("Cookie", cookie)
			.send({
				id: role.id,
				name: role.name,
				departmentFlags:   role.departmentFlags,
				roleFlags:         role.roleFlags,
				semesterFlags:     role.semesterFlags,
				tagFlags:          role.tagFlags,
				postFlags:         role.postFlags,
				commentFlags:      role.commentFlags,
				profanityFlags:    role.profanityFlags,
				userFlags:         role.userFlags,
				auditTrailFlags:   role.auditTrailFlags
			})
			.type(JSON_API_MEDIA_TYPE)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})

	it.todo("cannot accept invalid values")
	it.todo("cannot update missing model")
})
