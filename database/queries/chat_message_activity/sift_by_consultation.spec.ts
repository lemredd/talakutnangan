import Model from "%/models/chat_message_activity"
import ConsultationFactory from "~/factories/consultation"
import Factory from "~/factories/chat_message_activity"

import siftByConsultation from "./sift_by_consultation"

describe("Database Pipe: Sift by consultation", () => {
	it("can find on specific consultation", async() => {
		const consultation = await new ConsultationFactory().insertOne()
		const model = await new Factory()
		.consultation(() => Promise.resolve(consultation))
		.insertOne()

		const options = siftByConsultation({}, {
			"filter": {
				"consultationIDs": [ consultation.id ]
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("where.consultationID")
		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
		expect(foundModels).toHaveProperty("0.consultationID", consultation.id)
	})

	it("cannot find on specific consultation", async() => {
		const consultation = await new ConsultationFactory().insertOne()
		const otherConsultation = await new ConsultationFactory().insertOne()
		const model = await new Factory()
		.consultation(() => Promise.resolve(consultation))
		.insertOne()

		const options = siftByConsultation({}, {
			"filter": {
				"consultationIDs": [ otherConsultation.id ]
			}
		})
		const foundModels = await Model.findAll(options)

		expect(options).toHaveProperty("where.consultationID")
		expect(foundModels).toHaveLength(0)
	})
})
