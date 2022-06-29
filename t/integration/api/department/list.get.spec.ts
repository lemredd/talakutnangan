import { StatusCodes } from "http-status-codes"

import App from "~/set-ups/app"
import DepartmentFactory from "~/factories/department"
import Route from "!/app/routes/api/department/list.get"

describe("GET /api/deparment/list", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and get multiple departments", async () => {
		const { user: admin, cookie } = await App.makeAuthenticatedCookie()
		const departments = await (new DepartmentFactory()).insertMany(3)

		const response = await App.request
			.get("/api/department/list")
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(StatusCodes.OK)
		expect(response.body).toHaveProperty("data.0.type", "department")
		expect(response.body).toHaveProperty("data.0.id", admin.departmentID)
		expect(response.body).toHaveProperty("data.1.attributes.fullName", departments[0].fullName)
		expect(response.body).toHaveProperty("data.2.attributes.fullName", departments[1].fullName)
		expect(response.body).toHaveProperty("data.3.attributes.fullName", departments[2].fullName)
	})

	it.todo("cannot be accessed by guest users")
})
