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
			"scheduleEnd": schedule.scheduleEnd,
			"scheduleStart": schedule.scheduleStart
		}))
		const constraints = {
			"field": "hello",
			"request": {} as Request,
			"source": {
				"user": {
					"id": user.id
				}
			},
			"uniqueEmployeeSchedule": {
				"userIDPointer": "user.id"
			}
		}

		const sanitizeValue = (await uniqueEmployeeSchedule(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({
			"dayName": schedule.dayName,
			"scheduleEnd": schedule.scheduleEnd,
			"scheduleStart": schedule.scheduleStart
		})
	})

	it("can accept same value if employee schedule is the same", async() => {
		const user = await new UserFactory().insertOne()
		const schedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.dayName(() => "tuesday")
		.scheduleStart(() => convertTimeToMinutes("13:00"))
		.scheduleEnd(() => convertTimeToMinutes("15:00"))
		.insertOne()
		const value = Promise.resolve(makeInitialState({
			"dayName": schedule.dayName,
			"scheduleEnd": schedule.scheduleEnd,
			"scheduleStart": schedule.scheduleStart
		}))
		const constraints = {
			"field": "hello",
			"request": {} as Request,
			"source": {
				"employeeScheduleIDPointer": {
					"id": schedule.id
				},
				"user": {
					"id": user.id
				}
			},
			"uniqueEmployeeSchedule": {
				"employeeScheduleIDPointer": "employeeSchedule.id",
				"userIDPointer": "user.id"
			}
		}

		const sanitizeValue = (await uniqueEmployeeSchedule(value, constraints)).value

		expect(sanitizeValue).toStrictEqual({
			"dayName": schedule.dayName,
			"scheduleEnd": schedule.scheduleEnd,
			"scheduleStart": schedule.scheduleStart
		})
	})

	it("cannot accept invalid value", async() => {
		const user = await new UserFactory().insertOne()
		const schedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.dayName(() => "tuesday")
		.scheduleStart(() => convertTimeToMinutes("09:00"))
		.scheduleEnd(() => convertTimeToMinutes("15:00"))
		.makeOne()
		await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.dayName(() => "tuesday")
		.scheduleStart(() => convertTimeToMinutes("09:00"))
		.scheduleEnd(() => convertTimeToMinutes("12:00"))
		.insertOne()
		const value = Promise.resolve(makeInitialState({
			"dayName": schedule.dayName,
			"scheduleEnd": schedule.scheduleEnd,
			"scheduleStart": schedule.scheduleStart
		}))
		const constraints = {
			"field": "hello",
			"request": {} as Request,
			"source": {
				"user": {
					"id": user.id
				}
			},
			"uniqueEmployeeSchedule": {
				"userIDPointer": "user.id"
			}
		}

		try {
			await uniqueEmployeeSchedule(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
