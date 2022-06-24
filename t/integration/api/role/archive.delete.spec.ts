import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import Role from "%/models/role"
import RoleFactory from "~/factories/role"

import Route from "!/app/routes/api/role/archive(id).delete"

describe("DELETE /api/role/archive/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const role = await (new RoleFactory()).insertOne()

		const response = await App.request
			.delete(`/api/role/archive/${role.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)
		expect(response.body).toStrictEqual({})
		expect(await Role.findOne({ where: { id: role.id } })).toBeNull()
	})

	it.todo("cannot delete non-existing")
	it.todo("cannot redelete")

	it("cannot be accessed by guest users", async () => {
		const role = await (new RoleFactory()).insertOne()

		const response = await App.request
			.delete(`/api/role/archive/${role.id}`)

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
