import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/setups/mock_requester"

import Controller from "./list.get"

const QUERY_VALIDATION_INDEX = 0

describe("Controller: GET /api/audit_trail", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const queryValidation = validations[QUERY_VALIDATION_INDEX]
		const queryValidationFunction = queryValidation.intermediate.bind(queryValidation)
		requester.customizeRequest({
			"query": {
				"filter": {
					"existence": "*"
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
					"existence": "hello"
				}
			}
		})

		await requester.runMiddleware(queryValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.parameter", "filter.existence")
	})
})
