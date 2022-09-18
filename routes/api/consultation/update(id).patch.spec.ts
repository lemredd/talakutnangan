import ErrorBag from "$!/errors/error_bag"
import Factory from "~/factories/consultation"
import MockRequester from "~/set-ups/mock_requester"
import Controller from "./update(id).patch"

const BODY_VALIDATION_INDEX = 1

describe("Controller: PATCH /api/model/:id", () => {
	const requester = new MockRequester()

	it("can accept valid info with new details", async() => {
		const controller = new Controller()
		const { validations } = controller
		const bodyValidation = validations[BODY_VALIDATION_INDEX]
		const bodyValidationFunction = bodyValidation.intermediate.bind(bodyValidation)
		const model = await new Factory().insertOne()
		const newModel = await new Factory().startedAt(() => new Date()).makeOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"actionTaken": newModel.actionTaken,
						"attachedRoleID": newModel.attachedRoleID,
						"finishedAt": null,
						"reason": newModel.reason,
						"scheduledStartAt": newModel.scheduledStartAt.toJSON(),
						"startedAt": newModel.startedAt
					},
					"id": String(model.id),
					"relationships": {
						"consultant": {
							"data": {
								"id": String(model.consultant?.id),
								"type": "user"
							}
						}
					},
					"type": "consultation"
				},
				"meta": {
					"doesAllowConflicts": true
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
		const model = await new Factory().insertOne()
		requester.customizeRequest({
			"body": {
				"data": {
					"attributes": {
						"actionTaken": model.actionTaken,
						"attachedRoleID": model.attachedRoleID,
						"finishedAt": model.finishedAt,
						"reason": model.reason,
						"scheduledStartAt": model.scheduledStartAt.toJSON(),
						"startedAt": model.startedAt
					},
					"id": String(model.id),
					"relationships": {
						"consultant": {
							"data": {
								"id": String(model.consultant?.id),
								"type": "user"
							}
						}
					},
					"type": "consultation"
				},
				"meta": {
					"doesAllowConflicts": true
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
