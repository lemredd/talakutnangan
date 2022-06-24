import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import Department from "%/models/department"
import DepartmentFactory from "~/factories/department"

import Route from "!/app/routes/api/department/restore(id).patch"

describe("DELETE /api/department/restore/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const department = await (new DepartmentFactory()).insertOne()
		await department.destroy()

		const response = await App.request
			.patch(`/api/department/restore/${department.id}`)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)
		expect(response.body).toStrictEqual({})
		expect((await Department.findOne({ where: { id: department.id } }))!.deletedAt).toBeNull()
	})

	it.todo("cannot restore non-existing")
	it.todo("cannot restore existing")

	it("cannot be accessed by guest users", async () => {
		const department = await (new DepartmentFactory()).insertOne()

		const response = await App.request
			.patch(`/api/department/restore/${department.id}`)

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
