import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import { READ_OWN } from "$/permissions/user_combinations"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import RequestEnvironment from "$!/singletons/request_environment"
import { user as permissionGroup } from "$/permissions/permission_list"

import Route from "!%/api/employee_schedule/list.get"

describe("GET /api/employee_schedule", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by permitted user and multiple roles", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...READ_OWN))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			adminRole,
			userFactory => userFactory.beReachableEmployee()
		)
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const employeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()

		const response = await App.request
		.get("/api/employee_schedule")
		.query({ "filter": { "user": user.id } })
		.set("Cookie", cookie)
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.OK)
		expect(response.body).toHaveProperty("data.0.id", String(employeeSchedule.id))
	})
})
