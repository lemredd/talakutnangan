import RequestEnvironment from "!/helpers/request_environment"

import App from "~/set-ups/app"

import Route from "!/app/routes/api/user/import.post"

describe("POST /api/user/import", () => {
	beforeAll(async () => {
		await App.create(new Route())
	})

	it("can upload valid student details", async () => {
		const { user: admin, cookie } = await App.makeAuthenticatedCookie()
		const path = `${RequestEnvironment.root}/t/data/valid_student_details.csv`

		const response = await App.request
			.post("/api/user/import")
			.attach("importedCSV", path)
			.set("Cookie", cookie)

		expect(response.statusCode).toBe(RequestEnvironment.status.NOT_IMPLEMENTED)
		console.log(response.body)
	})

	it.todo("can upload invalid student details")
})
