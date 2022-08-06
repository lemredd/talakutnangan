import ErrorBag from "$!/errors/error_bag"
import ProfilePictureFactory from "~/factories/profile_picture"
import MockRequester from "~/set-ups/mock_requester"

import Controller from "./update.patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/user/:id/profile_picture/update", () => {
	const requester = new MockRequester()

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const profilePicture = await new ProfilePictureFactory().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "profile_picture",
					attributes: {
						profilePicture: {
							buffer: profilePicture.file,
							info: {
								mimeType: "image/png"
							}
						}
					}
				}
			}
		})

		await requester.runMiddleware(validationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const profilePicture = await new ProfilePictureFactory().makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "profile_picture",
					attributes: {
						profilePicture: {
							buffer: profilePicture.file,
							info: {
								mimeType: "image/xxx"
							}
						}
					}
				}
			}
		})

		await requester.runMiddleware(validationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.profilePicture")
	})
})
