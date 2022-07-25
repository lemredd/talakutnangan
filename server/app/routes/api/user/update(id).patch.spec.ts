import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"
import registerCustomValidators from "!/app/auth/register_custom_validators"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/user/update/:id", () => {
	const requester = new MockRequester()

	beforeAll(() => {
		registerCustomValidators()
	})

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await (new UserFactory()).insertOne()
		const newUser = await (new UserFactory()).makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "user",
					id: user.id,
					attributes: {
						name: newUser.name,
						email: newUser.email,
						signature: {
							buffer: user.signature,
							info: {
								filename: "signature.png",
								encoding: "utf-8",
								mimeType: "image/png"
							}
						}
					}
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
		const newUser = await (new UserFactory()).makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "user",
					id: user.id,
					attributes: {
						name: newUser.name,
						email: "random",
						signature: {
							buffer: newUser.signature,
							info: {
								filename: "signature.png",
								encoding: "utf-8",
								mimeType: "image/png"
							}
						}
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.email")
	})
})
