import { JSON_API_MEDIA_TYPE } from "!/types/independent"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import { CREATE } from "$/permissions/role_combinations"
import RequestEnvironment from "$!/singletons/request_environment"
import { role as permissionGroup } from "$/permissions/permission_list"

import Route from "!/app/routes/api/role/create.post"

describe("POST /api/role/create", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const adminRole = await new RoleFactory()
			.roleFlags(permissionGroup.generateMask(...CREATE))
			.insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const role = await (new RoleFactory()).makeOne()

		const response = await App.request
			.post("/api/role/create")
			.set("Cookie", cookie)
			.send({
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

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data.attributes.name).toBe(role.name)
	})

	it.todo("cannot accept invalid values")

	it("cannot be accessed without correct permission", async () => {
		const { user: admin, cookie } = await App.makeAuthenticatedCookie()
		const _roles = await (new RoleFactory()).insertOne()

		const response = await App.request
			.post("/api/role/create")
			.set("Cookie", cookie)
			.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})

	it("cannot be accessed by guest users", async () => {
		const role = await (new RoleFactory()).makeOne()

		const response = await App.request
			.post("/api/role/create")
			.accept(JSON_API_MEDIA_TYPE)
			.send({
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

		expect(response.statusCode).toBe(RequestEnvironment.status.UNAUTHORIZED)
	})
})
