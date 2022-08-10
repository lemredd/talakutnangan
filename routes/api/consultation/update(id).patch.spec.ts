import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import ConsultationFactory from "~/factories/consultation"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/consultation/update/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const consultation = await new ConsultationFactory().insertOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "consultation",
					id: consultation.id,
					attributes: {
						attachedRoleID: consultation.attachedRoleID,
						reason: consultation.reason,
						status: consultation.status,
						actionTaken: consultation.actionTaken,
						scheduledStartDatetime: consultation.scheduledStartDatetime,
						endDatetime: consultation.scheduledStartDatetime,
						//TODO Message
						//TODO Consultation Requesters
						//TODO Chat Message Activity
						deletedAt: null
					}
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		requester.expectSuccess()
	})
})
