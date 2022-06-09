import { StatusCodes } from "http-status-codes"

import App from "~/app"
import DepartmentFactory from "~/factories/department"
import DepartmentManager from "%/managers/department_manager"

import Route from "!/app/routes/api/department/create.post"

describe("POST /api/department/create", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async () => {
		const { user, cookie } = await App.makeAuthenticatedCookie()
		const department = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.post("/api/department/create")
			.set("Cookie", cookie)
			.send({
				acronym: department.acronym,
				fullName: department.fullName,
				mayAdmit: department.mayAdmit
			})

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toStrictEqual(
			{
				acronym: department.acronym,
				fullName: department.fullName,
				mayAdmit: department.mayAdmit
			}
		)
	})

	it("cannot be accessed by guest users", async () => {
		const department = await (new DepartmentFactory()).makeOne()

		const response = await App.request
			.post("/api/department/create")
			.send({
				acronym: department.acronym,
				fullName: department.fullName,
				mayAdmit: department.mayAdmit
			})

		expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED)
	})
})
