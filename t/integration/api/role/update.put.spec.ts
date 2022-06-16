import { StatusCodes } from "http-status-codes"

import App from "~/app"
import RoleFactory from "~/factories/role"

import Route from "!/app/routes/api/role/update.put"

describe("PUT /api/role/update", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
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

		expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)
	})

	it.todo("cannot accept invalid values")
	it.todo("cannot update missing model")

	it("cannot be accessed by guest users", async () => {
		const role = await (new RoleFactory()).insertOne()
		const newRoleDetails = await (new RoleFactory()).makeOne()

		const response = await App.request
			.put("/api/role/update")
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

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
