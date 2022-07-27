import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import RoleFactory from "~/factories/role"
import registerCustomValidators from "!/app/auth/register_custom_validators"

import Controller from "./list.get"

const BODY_VALIDATION_INDEX = 0

describe("Controller: GET /api/role/list", () => {
	const requester = new MockRequester()

	beforeAll(() => {
		registerCustomValidators()
	})

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await (new RoleFactory()).insertOne()
		await role.destroy({ force: false })
		requester.customizeRequest({
			query: {
				filter: {
					existence: "*"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})
})
