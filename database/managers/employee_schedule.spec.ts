import { DayValues } from "$/types/database"

import UserFactory from "~/factories/user"
import Model from "%/models/employee_schedule"
import Consultation from "%/models/consultation"
import Factory from "~/factories/employee_schedule"
import ConsultationFactory from "~/factories/consultation"
import AttachedRoleFactory from "~/factories/attached_role"
import findMinutesAfterMidnight from "%/helpers/find_minutes_after_midnight"

import Manager from "./employee_schedule"

describe("Database Manager: Employee schedule update operations", () => {
	it("can update resource and delete other consultations", async() => {
		jest.useRealTimers()
		const CURRENT_DATE_TIME = new Date()
		const FUTURE_DATE_TIME = new Date(CURRENT_DATE_TIME.valueOf() + 10 * 60 * 1000)
		const CONSULTATION_DAY = DayValues[FUTURE_DATE_TIME.getDay()]
		const START_DATETIME = findMinutesAfterMidnight(FUTURE_DATE_TIME)
		const FREE_DURATION_IN_MINUTES = 120
		const EMPLOYEE_SCHEDULE_START = START_DATETIME - FREE_DURATION_IN_MINUTES / 3 * 4
		const EMPLOYEE_SCHEDULE_END = START_DATETIME + FREE_DURATION_IN_MINUTES / 4
		const NEW_EMPLOYEE_SCHEDULE_START = EMPLOYEE_SCHEDULE_START - FREE_DURATION_IN_MINUTES / 4
		const NEW_EMPLOYEE_SCHEDULE_END = EMPLOYEE_SCHEDULE_END - FREE_DURATION_IN_MINUTES

		const attachedRole = await new AttachedRoleFactory().insertOne()
		await new ConsultationFactory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.scheduledStartAt(() => FUTURE_DATE_TIME)
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(attachedRole.user))
		.dayName(() => CONSULTATION_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const manager = new Manager({ "currentDateTime": CURRENT_DATE_TIME })

		await manager.update(model.id, {
			"dayName": CONSULTATION_DAY,
			"scheduleEnd": NEW_EMPLOYEE_SCHEDULE_END,
			"scheduleStart": NEW_EMPLOYEE_SCHEDULE_START,
			"userID": model.userID
		})

		expect(await Model.count()).toBe(1)
		expect(await Consultation.count()).toBe(0)
	})

	it("can update resource and retain other consultations", async() => {
		jest.useRealTimers()
		const CURRENT_DATE_TIME = new Date()
		const FUTURE_DATE_TIME = new Date(CURRENT_DATE_TIME.valueOf() + 5 * 60 * 1000)
		const CONSULTATION_DAY = DayValues[FUTURE_DATE_TIME.getDay()]
		const START_DATETIME = findMinutesAfterMidnight(FUTURE_DATE_TIME)
		const FREE_DURATION_IN_MINUTES = 100
		const EMPLOYEE_SCHEDULE_START = START_DATETIME - FREE_DURATION_IN_MINUTES / 3 * 4
		const EMPLOYEE_SCHEDULE_END = START_DATETIME + FREE_DURATION_IN_MINUTES / 4
		const MINUTE_SHIFT = FREE_DURATION_IN_MINUTES / 4 / 2
		const NEW_EMPLOYEE_SCHEDULE_START = EMPLOYEE_SCHEDULE_START - MINUTE_SHIFT
		const NEW_EMPLOYEE_SCHEDULE_END = EMPLOYEE_SCHEDULE_END - MINUTE_SHIFT

		const attachedRole = await new AttachedRoleFactory().insertOne()
		await new ConsultationFactory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.scheduledStartAt(() => FUTURE_DATE_TIME)
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(attachedRole.user))
		.dayName(() => CONSULTATION_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const manager = new Manager({ "currentDateTime": CURRENT_DATE_TIME })

		await manager.update(model.id, {
			"dayName": CONSULTATION_DAY,
			"scheduleEnd": NEW_EMPLOYEE_SCHEDULE_END,
			"scheduleStart": NEW_EMPLOYEE_SCHEDULE_START,
			"userID": model.userID
		})

		expect(await Model.count()).toBe(1)
		expect(await Consultation.count()).toBe(1)
	})
})

describe("Database Manager: Employee schedule archive operations", () => {
	it("can archive multiple resources", async() => {
		jest.useRealTimers()
		const CURRENT_DATE_TIME = new Date()
		const FUTURE_DATE_TIME = new Date(CURRENT_DATE_TIME.valueOf() + 10 * 60 * 1000)
		const CONSULTATION_DAY = DayValues[FUTURE_DATE_TIME.getDay()]
		const START_DATETIME = findMinutesAfterMidnight(FUTURE_DATE_TIME)
		const FREE_DURATION_IN_MINUTES = 90
		const EMPLOYEE_SCHEDULE_START = START_DATETIME - FREE_DURATION_IN_MINUTES / 2
		const EMPLOYEE_SCHEDULE_END = START_DATETIME + FREE_DURATION_IN_MINUTES / 2

		const attachedRole = await new AttachedRoleFactory().insertOne()
		const SECOND_FUTURE_DATE = new Date(
			FUTURE_DATE_TIME.getFullYear(),
			FUTURE_DATE_TIME.getMonth(),
			FUTURE_DATE_TIME.getDate() + 7,
			FUTURE_DATE_TIME.getHours(),
			FUTURE_DATE_TIME.getMinutes(),
			FUTURE_DATE_TIME.getSeconds()
		)
		const dates = [ FUTURE_DATE_TIME, SECOND_FUTURE_DATE ].values()
		await new ConsultationFactory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.scheduledStartAt(() => dates.next().value)
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertMany(2)
		const model = await new Factory()
		.user(() => Promise.resolve(attachedRole.user))
		.dayName(() => CONSULTATION_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const manager = new Manager()

		await manager.archiveBatch([ Number(model.id) ])

		expect(await Model.count()).toBe(0)
		expect(await Consultation.count()).toBe(0)
	})

	it("cannot archive consultations with unaffected schedules", async() => {
		jest.useRealTimers()
		const CURRENT_DATE_TIME = new Date()
		const FUTURE_DATE_TIME = new Date(CURRENT_DATE_TIME.valueOf() + 10 * 60 * 1000)
		const CONSULTATION_DAY = DayValues[FUTURE_DATE_TIME.getDay()]
		const START_DATETIME = findMinutesAfterMidnight(FUTURE_DATE_TIME)
		const FREE_DURATION_IN_MINUTES = 80
		const EMPLOYEE_SCHEDULE_START = START_DATETIME - FREE_DURATION_IN_MINUTES / 2
		const EMPLOYEE_SCHEDULE_END = START_DATETIME + FREE_DURATION_IN_MINUTES / 2

		const attachedRole = await new AttachedRoleFactory().insertOne()
		const UNAFFECTED_FUTURE_DATE = new Date(
			FUTURE_DATE_TIME.getFullYear(),
			FUTURE_DATE_TIME.getMonth(),
			FUTURE_DATE_TIME.getDate() + 4,
			FUTURE_DATE_TIME.getHours(),
			FUTURE_DATE_TIME.getMinutes(),
			FUTURE_DATE_TIME.getSeconds()
		)
		await new ConsultationFactory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.scheduledStartAt(() => UNAFFECTED_FUTURE_DATE)
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(attachedRole.user))
		.dayName(() => CONSULTATION_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const manager = new Manager({ "currentDateTime": CURRENT_DATE_TIME })

		await manager.archiveBatch([ Number(model.id) ])

		expect(await Model.count()).toBe(0)
		expect(await Consultation.count()).toBe(1)
	})

	it("cannot archive unowned consultations", async() => {
		jest.useRealTimers()
		const CURRENT_DATE_TIME = new Date()
		const FUTURE_DATE_TIME = new Date(CURRENT_DATE_TIME.valueOf() + 10 * 60 * 1000)
		FUTURE_DATE_TIME.setHours(8)
		const CONSULTATION_DAY = DayValues[FUTURE_DATE_TIME.getDay()]
		const START_DATETIME = findMinutesAfterMidnight(FUTURE_DATE_TIME)
		const FREE_DURATION_IN_MINUTES = 70
		const EMPLOYEE_SCHEDULE_START = START_DATETIME - FREE_DURATION_IN_MINUTES / 2
		const EMPLOYEE_SCHEDULE_END = START_DATETIME + FREE_DURATION_IN_MINUTES / 2

		const otherUser = await new UserFactory().insertOne()
		const attachedRole = await new AttachedRoleFactory().insertOne()
		await new ConsultationFactory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.scheduledStartAt(() => FUTURE_DATE_TIME)
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const model = await new Factory()
		.user(() => Promise.resolve(otherUser))
		.dayName(() => CONSULTATION_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const manager = new Manager({ "currentDateTime": CURRENT_DATE_TIME })

		await manager.archiveBatch([ Number(model.id) ])

		expect(await Model.count()).toBe(0)
		expect(await Consultation.count()).toBe(1)
	})
})

describe("Database Manager: Miscellaneous chat message operations", () => {
	it("can get sortable columns", () => {
		// Include in test to alert in case there are new columns to decide whether to expose or not
		const manager = new Manager()

		const { sortableColumns } = manager

		expect(sortableColumns).toStrictEqual([
			"-createdAt",
			"-dayName",
			"-deletedAt",
			"-id",
			"-scheduleEnd",
			"-scheduleStart",
			"-updatedAt",
			"createdAt",
			"dayName",
			"deletedAt",
			"id",
			"scheduleEnd",
			"scheduleStart",
			"updatedAt"
		])
	})
})
