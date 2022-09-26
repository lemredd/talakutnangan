import Factory from "~/factories/user"
import ErrorBag from "$!/errors/error_bag"
import DepartmentFactory from "~/factories/department"
import MockRequester from "~/setups/mock_requester"

import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/model/:id/department", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().beStudent().insertOne()
		const department = await new DepartmentFactory().mayAdmit().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"id": String(department.id),
					"type": "department"
				}
			},
			"params": {
				"id": String(model.id)
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().beStudent().insertOne()
		const department = await new DepartmentFactory().mayNotAdmit().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"id": String(department.id),
					"type": "department"
				}
			},
			"params": {
				"id": String(model.id)
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.id")
	})
})
