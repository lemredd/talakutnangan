import Model from "%/models/employee_schedule"
import Factory from "~/factories/employee_schedule"

import siftByDay from "./sift_by_day"

describe("Database Pipe: Sift by range", () => {
	it("can find on all employee schedules", async() => {
		const model = await new Factory().insertOne()

		const options = siftByDay({}, {
			"filter": {
				"day": "*"
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("can find on with day", async() => {
		const model = await new Factory().dayName(() => "monday").insertOne()

		const options = siftByDay({}, {
			"filter": {
				"day": "monday"
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("cannot find with day", async() => {
		await new Factory().dayName(() => "monday").insertOne()

		const options = siftByDay({}, {
			"filter": {
				"day": "tuesday"
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(0)
	})
})
