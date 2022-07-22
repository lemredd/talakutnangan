import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import DepartmentManager from "%/managers/department"
import DepartmentFactory from "~/factories/department"

import Route from "!/app/routes/api/department/read.get"

describe("GET /api/department/read", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()

		const response = await App.request
			.get("/api/department/read")
			.set("Cookie", cookie)
			.send({
				id: department.id
			})

		expect(response.statusCode).toBe(StatusCodes.OK)
		const expectedDepartment = await manager.findWithID(department.id)
		expect(response.body).toStrictEqual(
			JSON.parse(JSON.stringify(
				expectedDepartment
			))
		)
	})

	it("cannot be accessed by guest users", async () => {
		const manager = new DepartmentManager()
		const department = await (new DepartmentFactory()).insertOne()

		const response = await App.request
			.get("/api/department/read")
			.send({
				id: department.id
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})