import { StatusCodes } from "http-status-codes"

import App from "~/app"
import DepartmentFactory from "~/factories/department"
import DepartmentManager from "%/managers/department_manager"

import Route from "!/app/routes/api/department/archive(id).delete"

describe("DELETE /api/department/archive/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()

		const response = await App.request
			.delete(`/api/department/archive/${department.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.ACCEPTED)
		expect(response.body).toStrictEqual({})
		expect(manager.findWithID(department.id)).resolves.toBeNull()
	})

	it.todo("cannot delete non-existing")
	it.todo("cannot redelete")

	it("cannot be accessed by guest users", async () => {
		const department = await (new DepartmentFactory()).insertOne()

		const response = await App.request
			.delete(`/api/department/archive/${department.id}`)

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
