import Model from "%/models/post"
import Factory from "~/factories/post"

import pipe from "./sift_by_range"

describe("Database Pipe: Sift by range", () => {
	it("can find inside time span", async() => {
		const CURRENT_TIME = new Date()
		const TIME_OFFSET = 10
		const BEGIN_TIME = new Date()
		BEGIN_TIME.setSeconds(CURRENT_TIME.getSeconds() - TIME_OFFSET)
		const END_TIME = new Date()
		END_TIME.setSeconds(CURRENT_TIME.getSeconds() + TIME_OFFSET * 2)
		const model = await new Factory().insertOne()

		const options = pipe({}, {
			"filter": {
				"dateTimeRange": {
					"begin": BEGIN_TIME,
					"end": END_TIME
				}
			}
		})

		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("cannot find outside time span", async() => {
		const CURRENT_TIME = new Date()
		const TIME_OFFSET = 5
		const BEGIN_TIME = new Date()
		BEGIN_TIME.setSeconds(CURRENT_TIME.getSeconds() - TIME_OFFSET * 2)
		const END_TIME = new Date()
		END_TIME.setSeconds(CURRENT_TIME.getSeconds() - TIME_OFFSET)
		await new Factory().insertOne()

		const options = pipe({}, {
			"filter": {
				"dateTimeRange": {
					"begin": BEGIN_TIME,
					"end": END_TIME
				}
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(0)
	})
})
