import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import RequestEnvironment from "$!/singletons/request_environment"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import { user as permissionGroup } from "$/permissions/permission_list"
import { UPDATE_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import Route from "!%/api/employee_schedule/restore.patch"

describe("PATCH /api/employee_schedule", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const adminRole = await new RoleFactory()
		.userFlags(permissionGroup.generateMask(...UPDATE_ANYONE_ON_ALL_DEPARTMENTS))
		.insertOne()
		const { cookie } = await App.makeAuthenticatedCookie(
			adminRole,
			userFactory => userFactory.beReachableEmployee())
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const employeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		employeeSchedule.destroy()

		const response = await App.request
		.patch("/api/employee_schedule")
		.set("Cookie", cookie)
		.send({
			"data": [
				{
					"type": "employee_schedule",
					"id": String(employeeSchedule.id)
				}
			]
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})
})
