import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import ConsultationFactory from "~/factories/consultation"
import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe.skip("Controller: POST /api/consultation/create", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const consultation = await new ConsultationFactory().makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"type": "consultation",
					"attributes": {
						"attachedRoleID": consultation.attachedRoleID,
						"reason": consultation.reason,
						"status": consultation.status,
						"actionTaken": consultation.actionTaken,
						"scheduledStartDatetime": consultation.scheduledStartDatetime,
						"endDatetime": consultation.scheduledStartDatetime
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})
})
