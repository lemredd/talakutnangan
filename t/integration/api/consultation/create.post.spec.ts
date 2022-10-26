import { DayValues } from "$/types/database"
import { JSON_API_MEDIA_TYPE } from "$/types/server"

import App from "~/setups/app"

import Socket from "!/ws/socket"
import RoleFactory from "~/factories/role"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
import SignatureFactory from "~/factories/signature"
import StudentDetailFactory from "~/factories/student_detail"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"
import RequestEnvironment from "$!/singletons/request_environment"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import makeConsultationListOfUserNamespace from "$/namespace_makers/consultation_list_of_user"

import Route from "!%/api/consultation/create.post"

describe("POST /api/consultation", () => {
	beforeAll(async() => {
		await App.create(new Route())
	})

	it("can be accessed by authenticated user", async() => {
		const normalRole = await new RoleFactory().insertOne()
		const { user, cookie } = await App.makeAuthenticatedCookie(
			normalRole,
			userFactory => userFactory.beStudent())
		const consultant = await new UserFactory()
		.beReachableEmployee()
		.attach(normalRole)
		.insertOne()
		const model = await new Factory()
		.startedAt(() => null)
		.finishedAt(() => null)
		.makeOne()
		await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(consultant))
		.dayName(() => DayValues[model.scheduledStartAt.getDay()])
		.scheduleStart(() => convertTimeToMinutes("00:01"))
		.scheduleEnd(() => convertTimeToMinutes("23:59"))
		.insertOne()
		await new StudentDetailFactory().user(() => Promise.resolve(user)).insertOne()
		await new SignatureFactory().user(() => Promise.resolve(user)).insertOne()

		const response = await App.request
		.post("/api/consultation")
		.set("Cookie", cookie)
		.send({

			"data": {
				"attributes": {
					"actionTaken": model.actionTaken,
					"attachedRoleID": model.attachedRoleID,
					"finishedAt": model.finishedAt,
					"reason": model.reason,
					"scheduledStartAt": model.scheduledStartAt.toJSON()
				},
				"relationships": {
					"consultant": {
						"data": {
							"id": String(consultant.id),
							"type": "user"
						}
					},
					"consultantRole": {
						"data": {
							"id": String(normalRole.id),
							"type": "role"
						}
					},
					"participants": {
						"data": [
							{
								"id": String(consultant.id),
								"type": "user"
							},
							{
								"id": String(user.id),
								"type": "user"
							}
						]
					}
				},
				"type": "consultation"
			},
			"meta": {
				"doesAllowConflicts": true
			}
		})
		.type(JSON_API_MEDIA_TYPE)
		.accept(JSON_API_MEDIA_TYPE)

		expect(response.statusCode).toBe(RequestEnvironment.status.CREATED)
		expect(response.body.data.attributes.reason).toStrictEqual(model.reason)
		const previousCalls = Socket.consumePreviousCalls()
		expect(previousCalls).toHaveLength(2)
		expect(previousCalls[0].functionName).toBe("emitToClients")
		expect(previousCalls[0].arguments).toHaveProperty("eventName", "create")
		expect(previousCalls[0].arguments).toHaveProperty(
			"namespace",
			makeConsultationListOfUserNamespace(String(consultant.id))
		)
		expect(previousCalls[0].arguments).toHaveProperty("data.0.data.type", "consultation")
		expect(previousCalls[1].functionName).toBe("emitToClients")
		expect(previousCalls[1].arguments).toHaveProperty("eventName", "create")
		expect(previousCalls[1].arguments).toHaveProperty(
			"namespace",
			makeConsultationListOfUserNamespace(String(user.id))
		)
		expect(previousCalls[1].arguments).toHaveProperty("data.0.data.type", "consultation")
	})
})
