import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import User from "%/models/user"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import compare from "!/helpers/auth/compare"
import { RESET_PASSWORD } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import Route from "!/app/routes/api/user/reset_password(id).patch"

describe("PATCH /api/user/reset_password/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and admit other user", async () => {
		const adminRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask(...RESET_PASSWORD))
			.insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie(adminRole)
		const student = await (new UserFactory()).insertOne()

		const response = await App.request
			.patch(`/api/user/reset_password/${student.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)

		const updatedStudent = await User.findOne({ where: { id: student.id } })
		expect(compare("12345678", updatedStudent!.password)).resolves.toBeTruthy()
	})

	it("cannot be accessed by not permitted users", async () => {
		const otherRole = await new RoleFactory()
			.userFlags(permissionGroup.generateMask("view"))
			.insertOne()
		const { user: other, cookie } = await App.makeAuthenticatedCookie(otherRole)
		const student = await (new UserFactory()).insertOne()

		const response = await App.request
			.patch(`/api/user/reset_password/${student.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})

	it("cannot be accessed by guest users", async () => {
		const student = await (new UserFactory()).insertOne()

		const response = await App.request
			.patch(`/api/user/reset_password/${student.id}`)

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
