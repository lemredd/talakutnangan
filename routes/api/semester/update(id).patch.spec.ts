import ErrorBag from "$!/errors/error_bag"
import Factory from "~/factories/semester"
import MockRequester from "~/setups/mock_requester"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/semester/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().insertOne()
		const newModel = await new Factory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"endAt": String(newModel.endAt),
						"name": String(newModel.name),
						"semesterOrder": newModel.semesterOrder,
						"startAt": String(newModel.startAt)
					},
					"id": String(model.id),
					"type": "semester"
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
					"attributes": {
						"endAt": 1,
						"name": 1,
						"semesterOrder": 1,
						"startAt": 1
					},
					"id": String(model.id),
					"type": "semester"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(4)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.endAt")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.name")
		expect(body).toHaveProperty("2.source.pointer", "data.attributes.semesterOrder")
		expect(body).toHaveProperty("3.source.pointer", "data.attributes.startAt")
	})
})
