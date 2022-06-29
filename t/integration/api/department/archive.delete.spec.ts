import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import Department from "%/models/department"
import DepartmentFactory from "~/factories/department"

import Route from "!/app/routes/api/department/archive(id).delete"

describe("DELETE /api/department/archive/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const department = await (new DepartmentFactory()).insertOne()

		const response = await App.request
			.delete(`/api/department/archive/${department.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)
		expect(response.body).toStrictEqual({})
		expect(await Department.findOne({ where: { id: department.id } } )).toBeNull()
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
