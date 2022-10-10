import ErrorBag from "$!/errors/error_bag"
import Factory from "~/factories/post_attachment"
import MockRequester from "~/setups/mock_requester"

import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/post_attachment", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const model = await new Factory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"fileContents": {
							"buffer": model.fileContents,
							"info": {
								"mimeType": "image/png"
							}
						},
						"fileType": model.fileType
					},
					"type": "post_attachment"
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
		const model = await new Factory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"fileContents": {
							"buffer": model.fileContents,
							"info": {
								"mimeType": "image/xxx"
							}
						}
					},
					"type": "post_attachment"
				}
			}
		})

		await requester.runMiddleware(validationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.fileType")
	})
})
