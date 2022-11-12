import { DayValues } from "$/types/database"

import User from "%/models/user"
import ErrorBag from "$!/errors/error_bag"
import Factory from "~/factories/consultation"
import MockRequester from "~/setups/mock_requester"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/consultation/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const currentTime = Date.now()
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().insertOne()
		const newModel = await new Factory()
		.scheduledStartAt(() => new Date(currentTime - 1))
		.startedAt(() => new Date(currentTime))
		.finishedAt(() => null)
		.makeOne()
		await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(model.consultant as User))
		.dayName(() => DayValues[newModel.scheduledStartAt.getDay()])
		.scheduleStart(() => convertTimeToMinutes("00:00"))
		.scheduleEnd(() => convertTimeToMinutes("23:59"))
		.insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"actionTaken": newModel.actionTaken,
						"attachedRoleID": newModel.attachedRoleID,
						"finishedAt": null,
						"reason": newModel.reason,
						"scheduledStartAt": newModel.scheduledStartAt.toJSON(),
						"startedAt": newModel.startedAt?.toJSON()
					},
					"id": String(model.id),
					"relationships": {
						"consultant": {
							"data": {
								"id": String(model.consultant?.id),
								"type": "user"
							}
						}
					},
					"type": "consultation"
				},
				"meta": {
					"doesAllowConflicts": true
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
		const model = await new Factory().startedAt(() => null).insertOne()
		await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(model.consultant as User))
		.dayName(() => DayValues[model.scheduledStartAt.getDay() - 1])
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
						"scheduledStartAt": model.scheduledStartAt.toJSON(),
						"startedAt": model.startedAt
					},
					"id": String(model.id),
					"relationships": {
						"consultant": {
							"data": {
								"id": String(model.consultant?.id),
								"type": "user"
							}
						}
					},
					"type": "consultation"
				},
				"meta": {
					"doesAllowConflicts": true
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.finishedAt")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.scheduledStartAt")
	})
})
