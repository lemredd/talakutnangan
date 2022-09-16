import Factory from "~/factories/role"
import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"

import Controller from "./archive.delete"

const BODY_VALIDATION_INDEX = 0

describe("Controller: DELETE /api/role", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new Factory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"type": "role",
						"id": String(role.id)
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept already-archived resources", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const role = await new Factory().insertOne()
		await role.destroy({ "force": false })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"type": "role",
						"id": String(role.id)
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
		const role = await new Factory().insertOne()
		await role.destroy({ "force": true })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"type": "role",
						"id": String(role.id)
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
