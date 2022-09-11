import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/set-ups/app"
import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import RequestEnvironment from "$!/singletons/request_environment"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import { user as permissionGroup } from "$/permissions/permission_list"
import { UPDATE_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import Route from "!%/api/employee_schedule/update(id).patch"

describe("PATCH /api/employee_schedule/:id", () => {
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
		const newEmployeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.makeOne()

		const response = await App.request
		.patch(`/api/employee_schedule/${employeeSchedule.id}`)
		.set("Cookie", cookie)
		.send({
			"data": {
				"attributes": {
					"dayName": newEmployeeSchedule.dayName,
					"scheduleEnd": newEmployeeSchedule.scheduleEnd,
					"scheduleStart": newEmployeeSchedule.scheduleStart
				},
				"id": String(employeeSchedule.id),
				"relationships": {
					"user": {
						"data": {
							"id": String(user.id),
							"type": "user"
						}
					}
				},
				"type": "employee_schedule"
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.NO_CONTENT)
	})
})
