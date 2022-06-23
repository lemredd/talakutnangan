import RequestEnvironment from "!/helpers/request_environment"

import App from "~/set-ups/app"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import Route from "!/app/routes/api/user/import.post"

describe("POST /api/user/import", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can upload valid student details", async () => {
		const role = await (new RoleFactory()).insertOne()
		const IBCE = await (new DepartmentFactory().name(() => "I B C E")).insertOne()
		const IASTE = await (new DepartmentFactory().name(() => "I A S T E")).insertOne()
		const IHTM = await (new DepartmentFactory().name(() => "I H T M")).insertOne()
		const { user: admin, cookie } = await App.makeAuthenticatedCookie()
		const path = `${RequestEnvironment.root}/t/data/valid_student_details.csv`

		const response = await App.request
			.post("/api/user/import")
			.field("kind", "student")
			.field("roles[]", [ role.name ])
			.attach("importedCSV", path)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body.data).toHaveLength(3)
		expect(response.body.included).toHaveLength(4)
	})

	it.todo("can upload invalid student details")
})
