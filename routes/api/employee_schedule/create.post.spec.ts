import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/setups/mock_requester"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/employee_schedule", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.beReachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"dayName": employeeeSchedule.dayName,
						"scheduleEnd": employeeeSchedule.scheduleEnd,
						"scheduleStart": employeeeSchedule.scheduleStart
					},
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
			},
			"user": userFactory.serialize(user)
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept details for other users", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.beReachableEmployee().insertOne()
		const otherUser = await userFactory.beReachableEmployee().serializedOne(true)
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"dayName": employeeeSchedule.dayName,
						"scheduleEnd": employeeeSchedule.scheduleEnd,
						"scheduleStart": employeeeSchedule.scheduleStart
					},
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
			},
			"user": otherUser
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.relationships.user.data.id")
	})

	it("cannot accept non-compatibale user", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.beUnreachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"dayName": employeeeSchedule.dayName,
						"scheduleEnd": employeeeSchedule.scheduleEnd,
						"scheduleStart": employeeeSchedule.scheduleStart
					},
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
			},
			"user": userFactory.serialize(user)
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.relationships.user.data.id")
	})

	it("cannot accept conflicting info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.beReachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
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
			},
			"user": userFactory.serialize(user)
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes")
	})

	it("cannot accept invalid name", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.beReachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"dayName": "tue",
						"scheduleEnd": employeeeSchedule.scheduleEnd,
						"scheduleStart": employeeeSchedule.scheduleStart
					},
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
			},
			"user": userFactory.serialize(user)
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.dayName")
	})
})
