import type { Request } from "!/types/dependent"

import "~/set-ups/database.set_up"
import UserFactory from "~/factories/user"
import makeInitialState from "!/validators/make_initial_state"
import EmployeeScheduleFactory from "~/factories/employee_schedule"
import convertTimeToMinutes from "$/helpers/time/convert_time_to_minutes"
import uniqueEmployeeSchedule from "./unique_employee_schedule"

describe("Validator: unique employee schedule", () => {
	it("can accept valid input", async() => {
		const user = await new UserFactory().insertOne()
		const schedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.dayName(() => "monday")
		.scheduleStart(() => convertTimeToMinutes("13:00"))
		.scheduleEnd(() => convertTimeToMinutes("15:00"))
		.makeOne()
		await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.dayName(() => "monday")
		.scheduleStart(() => convertTimeToMinutes("08:00"))
		.scheduleEnd(() => convertTimeToMinutes("12:00"))
		.insertOne()
		const value = Promise.resolve(makeInitialState({
			"dayName": schedule.dayName,
			"scheduleStart": schedule.scheduleStart,
			"scheduleEnd": schedule.scheduleEnd
		}))
		const constraints = {
			"request": {} as Request,
			"source": {
				"user": {
					"id": user.id
				}
			},
			"field": "hello",
			"uniqueEmployeeSchedule": {
				"userIDPointer": "user.id"
			}
		}

		const sanitizeValue = (await uniqueEmployeeSchedule(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({
			"dayName": schedule.dayName,
			"scheduleStart": schedule.scheduleStart,
			"scheduleEnd": schedule.scheduleEnd
		})
	})

	it.skip("cannot accept invalid value", async() => {
		const user = await new UserFactory().insertOne()
		const schedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.dayName(() => "tuesday")
		.scheduleStart(() => convertTimeToMinutes("09:00"))
		.scheduleEnd(() => convertTimeToMinutes("15:00"))
		.makeOne()
		const createdSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.dayName(() => "tuesday")
		.scheduleStart(() => convertTimeToMinutes("09:00"))
		.scheduleEnd(() => convertTimeToMinutes("12:00"))
		.insertOne()
		console.log(createdSchedule)
		const value = Promise.resolve(makeInitialState({
			"dayName": schedule.dayName,
			"scheduleStart": schedule.scheduleStart,
			"scheduleEnd": schedule.scheduleEnd
		}))
		const constraints = {
			"request": {} as Request,
			"source": {
				"user": {
					"id": user.id
				}
			},
			"field": "hello",
			"uniqueEmployeeSchedule": {
				"userIDPointer": "user.id"
			}
		}

		const error = uniqueEmployeeSchedule(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
