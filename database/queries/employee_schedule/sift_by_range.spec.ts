import Model from "%/models/employee_schedule"
import Factory from "~/factories/employee_schedule"

import siftByRange from "./sift_by_range"

describe("Database Pipe: Sift by range", () => {
	it("can find on all employee schedules", async() => {
		const model = await new Factory().insertOne()

		const options = siftByRange({}, {
			"filter": {
				"employeeScheduleRange": "*"
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("can find on with limited time", async() => {
		const START_TIME = 0
		const END_TIME = 360
		const model = await new Factory()
		.dayName(() => "monday")
		.scheduleStart(() => START_TIME)
		.scheduleEnd(() => END_TIME)
		.insertOne()

		const options = siftByRange({}, {
			"filter": {
				"employeeScheduleRange": {
					"day": "monday",
					"end": END_TIME,
					"start": START_TIME
				}
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})

	it("cannot find with limited time", async() => {
		const START_TIME = 20
		const START_OFFSET = 20
		const END_TIME = 360
		const model = await new Factory()
		.dayName(() => "monday")
		.scheduleStart(() => START_TIME)
		.scheduleEnd(() => END_TIME)
		.insertOne()

		const options = siftByRange({}, {
			"filter": {
				"employeeScheduleRange": {
					"day": "monday",
					"end": END_TIME,
					"start": START_TIME + START_OFFSET
				}
			}
		})
		const foundModels = await Model.findAll(options)

		expect(foundModels).toHaveLength(1)
		expect(foundModels).toHaveProperty("0.id", model.id)
	})
})
