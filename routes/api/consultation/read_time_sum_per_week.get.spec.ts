import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/setups/mock_requester"

import Controller from "./read_time_sum_per_week.get"

const QUERY_VALIDATION_INDEX = 0

describe("Controller: GET /api/consultation/read_time_sum_by_week", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()

		const controller = new Controller()
		const { validations } = controller
		const queryValidation = validations[QUERY_VALIDATION_INDEX]
		const queryValidationFunction = queryValidation.intermediate.bind(queryValidation)
		requester.customizeRequest({
			"query": {
				"filter": {
					"dateTimeRange": {
						"begin": new Date(Date.now() - 1),
						"end": new Date()
					},
					"user": String(user.id)
				}
			}
		})

		await requester.runMiddleware(queryValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const queryValidation = validations[QUERY_VALIDATION_INDEX]
		const queryValidationFunction = queryValidation.intermediate.bind(queryValidation)
		requester.customizeRequest({
			"query": {
				"filter": {
					"dateTimeRange": {
						"begin": new Date(Date.now() - 1),
						"end": new Date()
					}
				}
			}
		})

		await requester.runMiddleware(queryValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.parameter", "filter.user")
	})
})
