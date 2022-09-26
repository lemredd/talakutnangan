import Factory from "~/factories/user"
import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/setups/mock_requester"

import Controller from "./update_password.patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/user/:id/update_password", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().serializedOne(true)
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"password": "12345678"
					},
					"id": String(model.data.id),
					"type": "user"
				},
				"meta": {
					"confirmPassword": "12345678",
					"currentPassword": "password"
				}
			},
			"user": model
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().serializedOne(true)
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"password": "12345678"
					},
					"id": String(model.data.id),
					"type": "user"
				},
				"meta": {
					"confirmPassword": "12345679",
					"currentPassword": "passworx"
				}
			},
			"user": model
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.password")
		expect(body).toHaveProperty("1.source.pointer", "meta.currentPassword")
	})
})
