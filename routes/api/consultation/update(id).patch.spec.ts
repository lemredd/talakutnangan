import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import ConsultationFactory from "~/factories/consultation"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/consultation/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new ConsultationFactory().insertOne()
		const newModel = await new ConsultationFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"actionTaken": newModel.actionTaken,
						"attachedRoleID": newModel.attachedRoleID,
						"finishedAt": null,
						"reason": newModel.reason,
						"scheduledStartAt": newModel.scheduledStartAt,
						"startedAt": newModel.startedAt
					},
					"id": String(model.id),
					"type": "consultation"
				}
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
		const consultation = await new ConsultationFactory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"actionTaken": consultation.actionTaken,
						"attachedRoleID": consultation.attachedRoleID,
						"finishedAt": consultation.finishedAt,
						"reason": consultation.reason,
						"scheduledStartAt": consultation.scheduledStartAt,
						"startedAt": consultation.startedAt
					},
					"id": String(consultation.id),
					"type": "consultation"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		// There are two errors due to `or` validator
		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.pointer", "data.attributes.finishedAt")
		expect(body).toHaveProperty("1.source.pointer", "data.attributes.finishedAt")
	})
})
