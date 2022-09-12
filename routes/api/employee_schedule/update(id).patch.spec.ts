import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/employee_schedule", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const newEmployeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"dayName": newEmployeeeSchedule.dayName,
						"scheduleEnd": newEmployeeeSchedule.scheduleEnd,
						"scheduleStart": newEmployeeeSchedule.scheduleStart
					},
					"id": String(employeeeSchedule.id),
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
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept same info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.dayName(() => "wednesday")
		.user(() => Promise.resolve(user))
		.insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"dayName": employeeeSchedule.dayName,
						"scheduleEnd": employeeeSchedule.scheduleEnd,
						"scheduleStart": employeeeSchedule.scheduleStart
					},
					"id": String(employeeeSchedule.id),
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
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("can accept valid user", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().beStudent().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const newEmployeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"dayName": newEmployeeeSchedule.dayName,
						"scheduleEnd": newEmployeeeSchedule.scheduleEnd,
						"scheduleStart": newEmployeeeSchedule.scheduleStart
					},
					"id": String(employeeeSchedule.id),
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
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.relationships.user.data.id")
	})

	it("cannot accept invalid name", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()
		const newEmployeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"dayName": "tue",
						"scheduleEnd": newEmployeeeSchedule.scheduleEnd,
						"scheduleStart": newEmployeeeSchedule.scheduleStart
					},
					"id": String(employeeeSchedule.id),
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
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.dayName")
	})
})
