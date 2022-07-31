import ErrorBag from "$!/errors/error_bag"
import RoleFactory from "~/factories/role"
import MockRequester from "~/set-ups/mock_requester"
import registerCustomValidators from "!/app/auth/register_custom_validators"

import Controller from "./list.get"

const BODY_VALIDATION_INDEX = 0

describe("Controller: GET /api/role/count_users", () => {
	const requester = new MockRequester()

	beforeAll(() => {
		registerCustomValidators()
	})

	it("can accept valid info", async () => {
		const role = await new RoleFactory().insertOne()
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		requester.customizeRequest({
			data: [
				{
					type: "role",
					id: role.id
				}
			]
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		requester.customizeRequest({
			data: [
				{
					type: "role",
					id: 1
				}
			]
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.parameter", "data.0.id")
	})
})
