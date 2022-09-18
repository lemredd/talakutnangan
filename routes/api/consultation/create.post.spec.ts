import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import Factory from "~/factories/consultation"
import MockRequester from "~/set-ups/mock_requester"
import Controller from "./create.post"

const BODY_VALIDATION_INDEX = 0

describe("Controller: POST /api/consultation", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const user = await new UserFactory().insertOne()
		const model = await new Factory()
		.finishedAt(() => null)
		.startedAt(() => null)
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"actionTaken": model.actionTaken,
						"attachedRoleID": model.attachedRoleID,
						"finishedAt": model.finishedAt,
						"reason": model.reason,
						"scheduledStartAt": model.scheduledStartAt.toJSON()
					},
					"relationships": {
						"consultant": {
							"data": {
								"id": String(model.consultant?.id),
								"type": "user"
							}
						},
						"consultantRole": {
							"data": {
								"id": String(model.consultantRole?.id),
								"type": "role"
							}
						},
						"participants": {
							"data": [
								{
									"id": String(user.id),
									"type": "user"
								}
							]
						}
					},
					"type": "consultation"
				},
				"meta": {
					"doesAllowConflicts": false,
					"reachableEmployeeID": String(model.consultant?.id)
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
		const model = await new Factory()
		.finishedAt(() => null)
		.startedAt(() => null)
		.makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"actionTaken": model.actionTaken,
						"attachedRoleID": model.attachedRoleID,
						"finishedAt": model.finishedAt?.toJSON(),
						"reason": model.reason,
						"scheduledStartAt": model.scheduledStartAt.toJSON()
					},
					"type": "consultation"
				}
			}
		})

		await requester.runMiddleware(bodyValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.pointer", "data.relationships")
		expect(body).toHaveProperty("1.source.pointer", "meta")
	})
})
