import ErrorBag from "$!/errors/error_bag"
import SemesterFactory from "~/factories/semester"
import MockRequester from "~/setups/mock_requester"

import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/semester", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const semester = await new SemesterFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"name": String(semester.name),
						"startAt": semester.startAt,
						"endAt": semester.endAt,
						"semesterOrder": semester.semesterOrder
					},
					"type": "semester"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid data", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"name": 1,
						"startAt": "not a date",
						"endAt": "not a date",
						"semesterOrder": 1
					},
					"type": "semester"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()

		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.name")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.semesterOrder")
	})
})
