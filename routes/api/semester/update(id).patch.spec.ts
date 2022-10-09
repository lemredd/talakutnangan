import ErrorBag from "$!/errors/error_bag"
import SemesterFactory from "~/factories/semester"
import MockRequester from "~/setups/mock_requester"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: POST /api/semester/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const semester = await new SemesterFactory().insertOne()
		const newPost = await new SemesterFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"name": String(newPost.name),
						"startAt": String(newPost.startAt),
						"endAt": String(newPost.endAt),
						"semesterOrder": newPost.semesterOrder
					},
					"id": String(semester.id),
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
		const semester = await new SemesterFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"name": 1,
						"startAt": 1,
						"endAt": 1,
						"semesterOrder": 1
					},
					"id": String(semester.id),
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
