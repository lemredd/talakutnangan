import Model from "%/models/chat_message"
import Factory from "~/factories/chat_message"
import ConsultationFactory from "~/factories/consultation"
import ChatMessageActivityFactory from "~/factories/chat_message_activity"

import siftByConsultation from "./sift_by_consultation"

describe("Database Pipe: Sift by consultation", () => {
	it("can find on specific consultation", async() => {
		const consultation = await new ConsultationFactory().insertOne()
		const activity = await new ChatMessageActivityFactory()
		.consultation(() => Promise.resolve(consultation))
		.insertOne()
		const model = await new Factory()
		.chatMessageActivity(() => Promise.resolve(activity))
		.insertOne()

		const options = siftByConsultation({}, {
			"filter": {
				"consultationIDs": [ consultation.id ]
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("include.0.where")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", activity.id)
	})

	it("cannot find on specific consultation", async() => {
		const consultation = await new ConsultationFactory().insertOne()
		const otherConsultation = await new ConsultationFactory().insertOne()
		const activity = await new ChatMessageActivityFactory()
		.consultation(() => Promise.resolve(consultation))
		.insertOne()

		const options = siftByConsultation({}, {
			"filter": {
				"consultationIDs": [ otherConsultation.id ]
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("include.0.where")
		expect(foundModels).toHaveLength(0)
	})
})
