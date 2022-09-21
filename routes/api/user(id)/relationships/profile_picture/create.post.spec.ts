import ErrorBag from "$!/errors/error_bag"
import ProfilePictureFactory from "~/factories/profile_picture"
import MockRequester from "~/setups/mock_requester"

import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 2

describe("Controller: POST /api/user/:id/profile_picture", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const profilePicture = await new ProfilePictureFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"type": "profile_picture",
					"attributes": {
						"fileContents": {
							"buffer": profilePicture.fileContents,
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
		const profilePicture = await new ProfilePictureFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"type": "profile_picture",
					"attributes": {
						"fileContents": {
							"buffer": profilePicture.fileContents,
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
