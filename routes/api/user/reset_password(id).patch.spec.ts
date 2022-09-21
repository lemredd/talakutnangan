import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/setups/mock_requester"

import Controller from "./reset_password(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/user/reset_password/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await (new UserFactory()).insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "user",
					id: String(user.id)
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await (new UserFactory()).insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "user",
					id: user.name
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.id")
	})
})
