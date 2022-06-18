import { StatusCodes } from "http-status-codes"

import App from "~/app"
import RoleManager from "%/managers/role"
import RoleFactory from "~/factories/role"

import Route from "!/app/routes/api/role/restore(id).patch"

describe("PATCH /api/role/restore/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const manager = new RoleManager()
		const role = await (new RoleFactory()).insertOne()
		const id = role.id
		await role.destroy()

		const response = await App.request
			.patch(`/api/role/restore/${role.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)
		expect(response.body).toStrictEqual({})
		expect((await manager.findWithID(id))!.deletedAt).toBeNull()
	})

	it.todo("cannot restore non-existing")
	it.todo("cannot restore existing")

	it("cannot be accessed by guest users", async () => {
		const role = await (new RoleFactory()).insertOne()

		const response = await App.request
			.patch(`/api/role/restore/${role.id}`)

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
