import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import ConsultationFactory from "~/factories/consultation"

import Controller from "./archive.delete"

const BODY_VALIDATION_INDEX = 0

describe("Controller: DELETE /api/consultation/archive", () => {
	const requester = new MockRequester()

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const consultation = await (new ConsultationFactory()).insertOne()
		requester.customizeRequest({
			body: {
				data: [
					{
						type: "consultation",
						id: consultation.id
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept already-archived resources", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const consultation = await (new ConsultationFactory()).insertOne()
		await consultation.destroy({ force: false })
		requester.customizeRequest({
			body: {
				data: [
					{
						type: "consultation",
						id: consultation.id
					}
				]
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(1)
		expect(body).toHaveProperty("0.source.pointer", "data.0.id")
	})

	it("cannot delete non-existent resources", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const consultation = await (new ConsultationFactory()).insertOne()
		await consultation.destroy({ force: true })
		requester.customizeRequest({
			body: {
				data: [
					{
						type: "consultation",
						id: consultation.id
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
