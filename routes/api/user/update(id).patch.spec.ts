import ErrorBag from "$!/errors/error_bag"
import Factory from "~/factories/user"
import MockRequester from "~/setups/mock_requester"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/user/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new Factory().insertOne()
		const newUser = await new Factory().email(() => "admin.head@example.com").makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"email": newUser.email,
						"name": newUser.name,

						"prefersDark": newUser.prefersDark
					},
					"id": String(user.id),
					"type": "user"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new Factory().insertOne()
		const newUser = await new Factory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"email": "random",
						"name": newUser.name,
						"prefersDark": newUser.prefersDark
					},
					"id": String(user.id),
					"type": "user"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.email")
	})
})
