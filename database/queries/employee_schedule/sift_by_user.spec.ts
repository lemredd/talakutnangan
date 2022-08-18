import User from "%/models/user"
import UserFactory from "~/factories/user"
import EmployeeSchedule from "%/models/employee_schedule"
import EmployeeScheduleFactory from "~/factories/employee_schedule"

import siftByUser from "./sift_by_user"

describe("Database Pipe: Sift by user", () => {
	it("can find on specific user", async() => {
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()

		const options = siftByUser({}, {
			"filter": {
				"user": user.id
			}
		})
		const foundEmployeeSchedules = await EmployeeSchedule.findAll(options)

		expect(options).toHaveProperty("include.0.where.id")
		expect(foundEmployeeSchedules).toHaveLength(1)
		expect(foundEmployeeSchedules).toHaveProperty("0.id", employeeeSchedule.id)
		expect(foundEmployeeSchedules).toHaveProperty("0.user.id", user.id)
	})

	it("can find on with existing user model", async() => {
		const user = await new UserFactory().beReachableEmployee().insertOne()
		const employeeeSchedule = await new EmployeeScheduleFactory()
		.user(() => Promise.resolve(user))
		.insertOne()

		const options = siftByUser({ "include": [ User ] }, {
			"filter": {
				"user": user.id
			}
		})
		const foundEmployeeSchedules = await EmployeeSchedule.findAll(options)

		expect(options).toHaveProperty("include.1.where.id")
		expect(foundEmployeeSchedules).toHaveLength(1)
		expect(foundEmployeeSchedules).toHaveProperty("0.id", employeeeSchedule.id)
		expect(foundEmployeeSchedules).toHaveProperty("0.user.id", user.id)
	})

	it("cannot find on unscheduled user", async() => {
		const user = await new UserFactory().beReachableEmployee().insertOne()

		const options = siftByUser({}, {
			"filter": {
				"user": user.id
			}
		})
		const foundEmployeeSchedules = await EmployeeSchedule.findAll(options)

		expect(options).toHaveProperty("include.0.where.id")
		expect(foundEmployeeSchedules).toHaveLength(0)
	})
})
