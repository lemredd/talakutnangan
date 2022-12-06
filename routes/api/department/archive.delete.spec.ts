import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/setups/mock_requester"
import Factory from "~/factories/department"
import UserFactory from "~/factories/user"

import Controller from "./archive.delete"

const BODY_VALIDATION_INDEX = 0

describe("Controller: DELETE /api/department", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new Factory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(department.id),
						"type": "department"
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept department with user", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new Factory().insertOne()
		await new UserFactory().in(department).insertOne()
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(department.id),
						"type": "department"
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.0.id")
	})

	it("cannot accept already-archived resources", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new Factory().insertOne()
		await department.destroy({ "force": false })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(department.id),
						"type": "department"
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.0.id")
	})

	it("cannot delete non-existent resources", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const department = await new Factory().insertOne()
		await department.destroy({ "force": true })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": String(department.id),
						"type": "department"
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
