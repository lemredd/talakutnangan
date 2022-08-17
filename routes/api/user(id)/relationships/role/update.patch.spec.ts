import ErrorBag from "$!/errors/error_bag"
import RoleFactory from "~/factories/role"
import MockRequester from "~/set-ups/mock_requester"

import Controller from "./update.patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/user/:id/role", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const validation = validations[BODY_VALIDATION_INDEX]
		const validationFunction = validation.intermediate.bind(validation)
		const roles = await new RoleFactory().insertMany(2)
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"type": "role",
						"id": String(roles[0].id)
					},
					{
						"type": "role",
						"id": String(roles[1].id)
					}
				]
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
		const roles = await new RoleFactory().insertMany(2)

		requester.customizeRequest({
			"body": {
				"data": [
					{
						"type": "role",
						"id": String(roles[0].id)
					},
					{
						"type": "role",
						"id": String(roles[1].id + 3)
					}
				]
			}
		})

		await requester.runMiddleware(validationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.1.id")
	})
})
