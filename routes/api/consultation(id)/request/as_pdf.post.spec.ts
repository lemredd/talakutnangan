import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/setups/mock_requester"
import Factory from "~/factories/consultation"
import Controller from "./as_pdf.post"

const BODY_VALIDATION_INDEX = 1

describe("Controller: POST /api/consultation/:id/request/as_pdf", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"id": String(model.id),
					"type": "consultation"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid data", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"id": String(model.id + 1),
					"type": "consultation"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.id")
	})
})
