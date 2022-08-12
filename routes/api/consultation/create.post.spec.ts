import ErrorBag from "$!/errors/error_bag"
import MockRequester from "~/set-ups/mock_requester"
import ConsultationFactory from "~/factories/consultation"
import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/consultation/create", () => {
	const requester = new MockRequester()

	it("can accept valid info", async () => {
		const controller = new Controller()
		const validations = controller.validations
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const consultation = await (new ConsultationFactory()).makeOne()
		requester.customizeRequest({
			body: {
				data: {
					type: "consultation",
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
