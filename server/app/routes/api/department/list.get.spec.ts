import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import DepartmentFactory from "~/factories/department"
import registerCustomValidators from "!/app/auth/register_custom_validators"

import Controller from "./list.get"

const BODY_VALIDATION_INDEX = 0

describe("Controller: GET /api/department/list", () => {
	const requester = new MockRequester()

	beforeAll(() => {
		registerCustomValidators()
	})

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await (new DepartmentFactory()).insertOne()
		await department.destroy({ force: false })
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
