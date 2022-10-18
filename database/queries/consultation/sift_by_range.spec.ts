import Model from "%/models/consultation"
import Factory from "~/factories/consultation"

import siftByRange from "./sift_by_range"

describe("Database Pipe: Sift by range", () => {
	it("can find on all models", async() => {
		const model = await new Factory().insertOne()

		const options = siftByRange({}, {
			"filter": {
				"consultationScheduleRange": "*"
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("can find on with limited time", async() => {
		const CURRENT_TIME = new Date()
		const TIME_OFFSET = 5
		const BEGIN_TIME = new Date()
		BEGIN_TIME.setSeconds(CURRENT_TIME.getSeconds() - TIME_OFFSET)
		const END_TIME = new Date()
		END_TIME.setSeconds(CURRENT_TIME.getSeconds() + TIME_OFFSET)
		const model = await new Factory()
		.scheduledStartAt(() => CURRENT_TIME)
		.insertOne()

		const options = siftByRange({}, {
			"filter": {
				"consultationScheduleRange": {
					"begin": BEGIN_TIME,
					"end": END_TIME
				}
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("cannot find with limited time", async() => {
		const CURRENT_TIME = new Date()
		const TIME_OFFSET = 5
		const BEGIN_TIME = new Date()
		BEGIN_TIME.setSeconds(CURRENT_TIME.getSeconds() + TIME_OFFSET)
		const END_TIME = new Date()
		END_TIME.setSeconds(CURRENT_TIME.getSeconds() + TIME_OFFSET * 2)
		await new Factory()
		.scheduledStartAt(() => CURRENT_TIME)
		.insertOne()

		const options = siftByRange({}, {
			"filter": {
				"consultationScheduleRange": {
					"begin": BEGIN_TIME,
					"end": END_TIME
				}
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(0)
	})
})
