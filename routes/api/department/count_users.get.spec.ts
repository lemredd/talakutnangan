import ErrorBag from "$!/errors/error_bag"
import DepartmentFactory from "~/factories/department"
import MockRequester from "~/set-ups/mock_requester"

import Controller from "./count_users.get"

const BODY_VALIDATION_INDEX = 0

describe("Controller: GET /api/department/count_users", () => {
	const requester = new MockRequester()

	it("can accept valid info", async () => {
		const department = await new DepartmentFactory().insertOne()
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		requester.customizeRequest({
			body: {
				data: [
					{
						type: "department",
						id: department.id
					}
				]
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
		requester.customizeRequest({
			body: {
				data: [
					{
						type: "department",
						id: 1
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.0.id")
	})
})
