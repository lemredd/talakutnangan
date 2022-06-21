import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import DepartmentManager from "%/managers/department"
import DepartmentFactory from "~/factories/department"

import Route from "!/app/routes/api/department/update.put"

describe("PUT /api/department/update", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const department = await (new DepartmentFactory()).insertOne()
		const newDepartmentDetails = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.put("/api/department/update")
			.set("Cookie", cookie)
			.send({
				id: department.id,
				acronym: newDepartmentDetails.acronym,
				fullName: newDepartmentDetails.fullName,
				mayAdmit: newDepartmentDetails.mayAdmit
			})

		expect(response.statusCode).toBe(StatusCodes.NO_CONTENT)
	})

	it.todo("cannot accept invalid values")
	it.todo("cannot update missing model")

	it("cannot be accessed by guest users", async () => {
		const department = await (new DepartmentFactory()).insertOne()
		const newDepartmentDetails = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.put("/api/department/update")
			.send({
				id: department.id,
				acronym: newDepartmentDetails.acronym,
				fullName: newDepartmentDetails.fullName,
				mayAdmit: newDepartmentDetails.mayAdmit
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
