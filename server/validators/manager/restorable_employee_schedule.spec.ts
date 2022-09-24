import type { Request } from "!/types/dependent"
import type {
	ValidationConstraints,
	RestorableEmployeeScheduleConstraints
} from "!/types/validation"

import "~/setups/database.setup"
import Manager from "%/managers/employee_schedule"
import Factory from "~/factories/employee_schedule"
import makeInitialState from "!/validators/make_initial_state"
import restorableEmployeeSchedule from "./restorable_employee_schedule"

describe("Validator: restorable employee schedule", () => {
	it("can accept valid input", async() => {
		const START_TIME = 0
		const END_TIME = 360
		const model = await new Factory()
		.scheduleStart(() => START_TIME)
		.scheduleEnd(() => END_TIME)
		.insertOne()
		await model.destroy({ "force": false })
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"field": "hello",
			"manager": {
				"className": Manager,
				"columnName": "id"
			},
			"request": {} as Request,
			"restorableEmployeeSchedule": {
				"userIDPointer": "id"
			},
			"source": {
				"id": model.userID
			}
		} as unknown as ValidationConstraints<Request>
		& Partial<RestorableEmployeeScheduleConstraints>

		const sanitizeValue = (await restorableEmployeeSchedule(value, constraints)).value

		expect(sanitizeValue).toEqual(model.id)
	})

	it("cannot accept existing value", async() => {
		const START_TIME = 1
		const END_TIME = 360
		const model = await new Factory()
		.scheduleStart(() => START_TIME)
		.scheduleEnd(() => END_TIME)
		.insertOne()
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"field": "hello",
			"manager": {
				"className": Manager,
				"columnName": "id"
			},
			"request": {} as Request,
			"restorableEmployeeSchedule": {
				"userIDPointer": "id"
			},
			"source": {
				"id": model.userID
			}
		} as unknown as ValidationConstraints<Request>
		& Partial<RestorableEmployeeScheduleConstraints>

		const error = restorableEmployeeSchedule(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})

	it("cannot accept invalid value", async() => {
		const START_TIME = 0
		const START_TIME_OFFSET = 20
		const END_TIME = 350
		await new Factory()
		.scheduleStart(() => START_TIME + START_TIME_OFFSET)
		.scheduleEnd(() => END_TIME)
		.insertOne()
		const model = await new Factory()
		.scheduleStart(() => START_TIME)
		.scheduleEnd(() => END_TIME)
		.insertOne()
		await model.destroy({ "force": false })
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"field": "hello",
			"manager": {
				"className": Manager,
				"columnName": "id"
			},
			"request": {} as Request,
			"restorableEmployeeSchedule": {
				"end": END_TIME,
				"start": START_TIME
			},
			"source": {
				"id": model.userID
			}
		} as unknown as ValidationConstraints<Request>
		& Partial<RestorableEmployeeScheduleConstraints>

		const error = restorableEmployeeSchedule(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
