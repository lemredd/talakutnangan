import { StatusCodes } from "http-status-codes"

import App from "~/app"
import DepartmentFactory from "~/factories/department"
import DepartmentManager from "%/managers/department_manager"

import Route from "!/app/routes/api/department/read.get"

describe("GET /api/department/read", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()

		const response = await App.request
			.get("/api/department/read")
			.send({
				id: department.id
			})

		expect(response.statusCode).toBe(StatusCodes.OK)
		const expectedDepartment = await manager.findWithID(department.id)
		expect(response.body).toStrictEqual(
			JSON.parse(JSON.stringify([
				expectedDepartment
			]))
		)
	})

	it.todo("cannot be accessed by guest users")
})
