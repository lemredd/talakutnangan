import { DayValues } from "$/types/database"

import User from "%/models/user"
import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
import MockRequester from "~/setups/mock_requester"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/consultation", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().insertOne()
		const model = await new Factory()
		.finishedAt(() => null)
		.startedAt(() => null)
		.makeOne()
		await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(model.consultant as User))
		.dayName(() => DayValues[model.scheduledStartAt.getDay()])
		.scheduleStart(() => convertTimeToMinutes("00:00"))
		.scheduleEnd(() => convertTimeToMinutes("23:59"))
		.insertOne()
		requester.customizeRequest({
			"body": {
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
								"id": String(model.consultant?.id),
								"type": "user"
							}
						},
						"consultantRole": {
							"data": {
								"id": String(model.consultantRole?.id),
								"type": "role"
							}
						},
						"participants": {
							"data": [
								{
									"id": String(model.consultant?.id),
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
					"doesAllowConflicts": false
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory()
		.finishedAt(() => null)
		.startedAt(() => null)
		.makeOne()
		await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(model.consultant as User))
		.dayName(() => DayValues[model.scheduledStartAt.getDay()])
		.scheduleStart(() => convertTimeToMinutes("00:00"))
		.scheduleEnd(() => convertTimeToMinutes("23:58"))
		.insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"actionTaken": model.actionTaken,
						"attachedRoleID": model.attachedRoleID,
						"finishedAt": model.finishedAt?.toJSON(),
						"reason": model.reason,
						"scheduledStartAt": model.scheduledStartAt.toJSON()
					},
					"type": "consultation"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(3)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.scheduledStartAt")
		expect(body).toHaveProperty("1.source.pointer", "data.relationships")
		expect(body).toHaveProperty("2.source.pointer", "meta")
	})
})
