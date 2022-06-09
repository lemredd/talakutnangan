import { StatusCodes } from "http-status-codes"

import App from "~/app"
import DepartmentFactory from "~/factories/department"
import DepartmentManager from "%/managers/department_manager"

import Route from "!/app/routes/api/department/update(id).put"

describe("PUT /api/department/update/:id", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const department = await (new DepartmentFactory()).insertOne()
		const newDepartmentDetails = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.put(`/api/department/update/${department.id}`)
			.set("Cookie", cookie)
			.send({
				acronym: newDepartmentDetails.acronym,
				fullName: newDepartmentDetails.fullName,
				mayAdmit: newDepartmentDetails.mayAdmit
			})

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toBe(1)
	})

	it.todo("cannot accept invalid values")
	it.todo("cannot update missing model")

	it("cannot be accessed by guest users", async () => {
		const department = await (new DepartmentFactory()).insertOne()
		const newDepartmentDetails = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.put(`/api/department/update/${department.id}`)
			.send({
				acronym: newDepartmentDetails.acronym,
				fullName: newDepartmentDetails.fullName,
				mayAdmit: newDepartmentDetails.mayAdmit
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
