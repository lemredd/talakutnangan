import ErrorBag from "$!/errors/error_bag"
import SignatureFactory from "~/factories/signature"
import MockRequester from "~/setups/mock_requester"

import Controller from "./update.patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/user/:id/signature", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const signature = await new SignatureFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"type": "signature",
					"attributes": {
						"fileContents": {
							"buffer": signature.fileContents,
							"info": {
								"mimeType": "image/png"
							}
						}
					}
				}
			}
		})

		await requester.runMiddleware(validationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const signature = await new SignatureFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"type": "signature",
					"attributes": {
						"fileContents": {
							"buffer": signature.fileContents,
							"info": {
								"mimeType": "image/xxx"
							}
						}
					}
				}
			}
		})

		await requester.runMiddleware(validationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.fileContents")
	})
})
