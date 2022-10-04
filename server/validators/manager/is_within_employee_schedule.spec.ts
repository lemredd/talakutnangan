import type { Request } from "!/types/dependent"
import { DayValues } from "$/types/database"

import "~/setups/database.setup"
import UserFactory from "~/factories/user"
import Factory from "~/factories/employee_schedule"
import makeInitialState from "!/validators/make_initial_state"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"
import isWithinEmployeeSchedule from "./is_within_employee_schedule"

describe("Validator: Is within employee schedule", () => {
	it("can accept valid input", async() => {
		// The schedule is in GMT+0 but it will be extracted with native `get` methods
		const CONSULTATION_SCHEDULED_START = new Date("2022-10-03T00:30:00.000Z")
		const EMPLOYEE_SCHEDULE_START = convertTimeToMinutes("08:00")
		const EMPLOYEE_SCHEDULE_END = convertTimeToMinutes("12:00")
		const EMPLOYEE_SCHEDULE_DAY = DayValues[CONSULTATION_SCHEDULED_START.getDay()]

		const user = await new UserFactory().beReachableEmployee().insertOne()
		await new Factory()
		.user(() => Promise.resolve(user))
		.dayName(() => EMPLOYEE_SCHEDULE_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()
		const value = Promise.resolve(makeInitialState(CONSULTATION_SCHEDULED_START))
		const constraints = {
			"field": "hello",
			"isWithinEmployeeSchedule": {
				"userIDPointer": "user.id"
			},
			"request": {} as Request,
			"source": {
				"user": {
					"id": String(user.id)
				}
			}
		}

		const sanitizeValue = (await isWithinEmployeeSchedule(value, constraints)).value

		expect(sanitizeValue).toEqual(CONSULTATION_SCHEDULED_START)
	})

	it("cannot accept invalid value", async() => {
		// The schedule is in GMT+0 but it will be extracted with native `get` methods
		const CONSULTATION_SCHEDULED_START = new Date("2022-10-02T23:30:00.000Z")
		const EMPLOYEE_SCHEDULE_START = convertTimeToMinutes("07:00")
		const EMPLOYEE_SCHEDULE_END = convertTimeToMinutes("11:00")
		const EMPLOYEE_SCHEDULE_DAY = DayValues[CONSULTATION_SCHEDULED_START.getDay()]

		const user = await new UserFactory().beReachableEmployee().insertOne()
		await new Factory()
		.user(() => Promise.resolve(user))
		.dayName(() => EMPLOYEE_SCHEDULE_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const value = Promise.resolve(makeInitialState(CONSULTATION_SCHEDULED_START))
		const constraints = {
			"field": "hello",
			"isWithinEmployeeSchedule": {
				"userIDPointer": "user.id"
			},
			"request": {} as Request,
			"source": {
				"user": {
					"id": String(user.id)
				}
			}
		}

		const error = isWithinEmployeeSchedule(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
