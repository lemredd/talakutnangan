import ErrorBag from "$!/errors/error_bag"
import UserFactory from "~/factories/user"
import MockRequester from "~/set-ups/mock_requester"
import Factory from "~/factories/chat_message_activity"
import ConsultationFactory from "~/factories/consultation"

import Controller from "./list.get"

const QUERY_VALIDATION_INDEX = 0

describe("Controller: GET /api/chat_message_activity", () => {
	const requester = new MockRequester()

	it("can accept valid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const queryValidation = validations[QUERY_VALIDATION_INDEX]
		const queryValidationFunction = queryValidation.intermediate.bind(queryValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		const consultation = await new ConsultationFactory().insertOne()
		await new Factory()
		.consultation(() => Promise.resolve(consultation))
		.user(() => Promise.resolve(user))
		.insertOne()
		requester.customizeRequest({
			"query": {
				"filter": {
					"consultationIDs": String(consultation.id),
					"existence": "present"
				}
			},
			"user": userFactory.serialize(user)
		})

		await requester.runMiddleware(queryValidationFunction)

		requester.expectSuccess()
	})

	it("cannot accept invalid info", async() => {
		const controller = new Controller()
		const { validations } = controller
		const queryValidation = validations[QUERY_VALIDATION_INDEX]
		const queryValidationFunction = queryValidation.intermediate.bind(queryValidation)
		const userFactory = new UserFactory()
		const user = await userFactory.insertOne()
		requester.customizeRequest({
			"query": {
				"filter": {
					"existence": "hello"
				}
			},
			"user": userFactory.serialize(user)
		})

		await requester.runMiddleware(queryValidationFunction)

		const body = requester.expectFailure(ErrorBag).toJSON()
		expect(body).toHaveLength(2)
		expect(body).toHaveProperty("0.source.parameter", "filter.consultationIDs")
		expect(body).toHaveProperty("1.source.parameter", "filter.existence")
	})
})
