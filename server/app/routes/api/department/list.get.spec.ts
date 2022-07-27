import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import registerCustomValidators from "!/app/auth/register_custom_validators"

import Controller from "./list.get"

const QUERY_VALIDATION_INDEX = 0

describe("Controller: GET /api/department/list", () => {
	const requester = new MockRequester()

	beforeAll(() => {
		registerCustomValidators()
	})

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const queryValidation = validations[QUERY_VALIDATION_INDEX]
		const queryValidationFunction = queryValidation.intermediate.bind(queryValidation)
		requester.customizeRequest({
			query: {
				filter: {
					existence: "*"
				}
			}
		})

		await requester.runMiddleware(queryValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const queryValidation = validations[QUERY_VALIDATION_INDEX]
		const queryValidationFunction = queryValidation.intermediate.bind(queryValidation)
		requester.customizeRequest({
			query: {
				filter: {
					existence: "hello"
				}
			}
		})

		await requester.runMiddleware(queryValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.parameter", "filter.existence")
	})
})
