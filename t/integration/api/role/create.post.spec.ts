import { StatusCodes } from "http-status-codes"

import App from "~/app"
import RoleFactory from "~/factories/role"

import Route from "!/app/routes/api/role/create.post"

describe("POST /api/role/create", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
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

		expect(response.statusCode).toBe(StatusCodes.CREATED)
		expect(response.body.name).toBe(role.name)
	})

	it.todo("cannot accept invalid values")

	it("cannot be accessed by guest users", async () => {
		const role = await (new RoleFactory()).makeOne()

		const response = await App.request
			.post("/api/role/create")
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
			});

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
