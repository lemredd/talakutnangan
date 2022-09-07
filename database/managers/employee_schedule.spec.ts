import { DayValues } from "$/types/database"

import Model from "%/models/consultation"
import Factory from "~/factories/employee_schedule"
import Consultation from "%/models/employee_schedule"
import ConsultationFactory from "~/factories/consultation"
import AttachedRoleFactory from "~/factories/attached_role"
import findMinutesAfterMidnight from "%/managers/helpers/find_minutes_after_midnight"

import Manager from "./employee_schedule"

describe("Database Manager: Employee schedule update operations", () => {
	it("can update resource and delete other consultations", async() => {
		const DATE_NOW = new Date()
		const CONSULTATION_DAY = DayValues[DATE_NOW.getDay()]
		const START_DATETIME = findMinutesAfterMidnight(DATE_NOW)
		const FREE_DURATION_IN_MINUTES = 120
		const EMPLOYEE_SCHEDULE_START = START_DATETIME - FREE_DURATION_IN_MINUTES / 2
		const EMPLOYEE_SCHEDULE_END = START_DATETIME + FREE_DURATION_IN_MINUTES / 2
		const NEW_EMPLOYEE_SCHEDULE_START = EMPLOYEE_SCHEDULE_START - FREE_DURATION_IN_MINUTES / 2
		const NEW_EMPLOYEE_SCHEDULE_END = EMPLOYEE_SCHEDULE_END - FREE_DURATION_IN_MINUTES / 2

		const attachedRole = await new AttachedRoleFactory().insertOne()
		await new ConsultationFactory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.scheduledStartAt(() => DATE_NOW)
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const model = await new Factory()
		.dayName(() => CONSULTATION_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const manager = new Manager()

		await manager.update(model.id, {
			"dayName": CONSULTATION_DAY,
			"scheduleEnd": NEW_EMPLOYEE_SCHEDULE_END,
			"scheduleStart": NEW_EMPLOYEE_SCHEDULE_START
		})

		expect(await Model.count()).toBe(1)
		expect(await Consultation.count()).toBe(0)
	})

	it("can update resource and retain other consultations", async() => {
		const DATE_NOW = new Date()
		const CONSULTATION_DAY = DayValues[DATE_NOW.getDay()]
		const START_DATETIME = findMinutesAfterMidnight(DATE_NOW)
		const FREE_DURATION_IN_MINUTES = 100
		const EMPLOYEE_SCHEDULE_START = START_DATETIME - FREE_DURATION_IN_MINUTES / 2
		const EMPLOYEE_SCHEDULE_END = START_DATETIME + FREE_DURATION_IN_MINUTES / 2
		const MINUTE_SHIFT = 15
		const NEW_EMPLOYEE_SCHEDULE_START = EMPLOYEE_SCHEDULE_START - MINUTE_SHIFT
		const NEW_EMPLOYEE_SCHEDULE_END = EMPLOYEE_SCHEDULE_END - MINUTE_SHIFT

		const attachedRole = await new AttachedRoleFactory().insertOne()
		await new ConsultationFactory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.scheduledStartAt(() => DATE_NOW)
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const model = await new Factory()
		.dayName(() => CONSULTATION_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const manager = new Manager()

		await manager.update(model.id, {
			"dayName": CONSULTATION_DAY,
			"scheduleEnd": NEW_EMPLOYEE_SCHEDULE_END,
			"scheduleStart": NEW_EMPLOYEE_SCHEDULE_START
		})

		expect(await Model.count()).toBe(1)
		expect(await Consultation.count()).toBe(1)
	})
})

describe("Database Manager: Employee schedule archive operations", () => {
	it("can archive multiple resource", async() => {
		const DATE_NOW = new Date()
		const CONSULTATION_DAY = DayValues[DATE_NOW.getDay()]
		const START_DATETIME = findMinutesAfterMidnight(DATE_NOW)
		const FREE_DURATION_IN_MINUTES = 90
		const EMPLOYEE_SCHEDULE_START = START_DATETIME - FREE_DURATION_IN_MINUTES / 2
		const EMPLOYEE_SCHEDULE_END = START_DATETIME + FREE_DURATION_IN_MINUTES / 2

		const attachedRole = await new AttachedRoleFactory().insertOne()
		await new ConsultationFactory()
		.consultantInfo(() => Promise.resolve(attachedRole))
		.scheduledStartAt(() => DATE_NOW)
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const model = await new Factory()
		.dayName(() => CONSULTATION_DAY)
		.scheduleStart(() => EMPLOYEE_SCHEDULE_START)
		.scheduleEnd(() => EMPLOYEE_SCHEDULE_END)
		.insertOne()

		const manager = new Manager()

		await manager.archiveBatch([ Number(model.id) ])

		expect(await Model.count()).toBe(0)
		expect(await Consultation.count()).toBe(0)
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
