import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/setups/mock_requester"
import ConsultationFactory from "~/factories/chat_message_activity"

import Controller from "./restore.patch"

const BODY_VALIDATION_INDEX = 0

describe.skip("Controller: PATCH /api/chat_message_activity", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new ConsultationFactory().insertOne()
		await model.destroy({ "force": false })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": model.id,
						"type": "chat_message_activity"
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept existing resources", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new ConsultationFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": model.id,
						"type": "chat_message_activity"
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.0.id")
	})

	it("cannot accept non-existent resources", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new ConsultationFactory().insertOne()
		await model.destroy({ "force": true })
		requester.customizeRequest({
			"body": {
				"data": [
					{
						"id": model.id,
						"type": "chat_message_activity"
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
