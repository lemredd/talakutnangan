import { faker } from "@faker-js/faker"

import { Day, DayValues } from "$/types/database"
import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	DeserializedEmployeeScheduleResource,
	DeserializedEmployeeScheduleDocument,
	DeserializedEmployeeScheduleListDocument,
	EmployeeScheduleResource,
	EmployeeScheduleDocument,
	EmployeeScheduleListDocument
} from "$/types/documents/employee_schedule"

import { MINUTE_SCHEDULE_INTERVAL } from "$/constants/numerical"

import User from "%/models/user"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import EmployeeSchedule from "%/models/employee_schedule"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"
import convertTimeToMinutes from "$/time/convert_time_to_minutes"

export default class EmployeeScheduleFactory extends BaseFactory<
	EmployeeSchedule,
	EmployeeScheduleResourceIdentifier<"read">,
	EmployeeScheduleAttributes<"serialized">,
	EmployeeScheduleAttributes<"deserialized">,
	EmployeeScheduleResource,
	DeserializedEmployeeScheduleResource,
	EmployeeScheduleDocument,
	EmployeeScheduleListDocument,
	DeserializedEmployeeScheduleDocument,
	DeserializedEmployeeScheduleListDocument
> {
	#user: () => Promise<User> = async() => await new UserFactory().insertOne()
	#dayName: () => Day = () => faker.helpers.arrayElement(DayValues)
	#scheduleStart: () => number = () => {
		let raw = faker.datatype.number({ "max": convertTimeToMinutes("10:00") })
		raw -= raw % MINUTE_SCHEDULE_INTERVAL
		return raw
	}

	#scheduleEnd: (scheduleStart: number) => number = (scheduleStart: number) => {
		let raw = faker.datatype.number({
			"max": convertTimeToMinutes("20:30"),
			"min": scheduleStart + MINUTE_SCHEDULE_INTERVAL
		})
		raw -= raw % MINUTE_SCHEDULE_INTERVAL
		return raw
	}

	get model(): ModelCtor<EmployeeSchedule> { return EmployeeSchedule }

	get transformer(): EmployeeScheduleTransformer { return new EmployeeScheduleTransformer() }

	async generate(): GeneratedData<EmployeeSchedule> {
		const [ dayName, scheduleStart, scheduleEnd ] = faker.helpers.unique(() => {
			const rawDay = this.#dayName()
			const rawScheduleStart = this.#scheduleStart()
			const rawScheduleEnd = this.#scheduleEnd(rawScheduleStart)

			return `${rawDay}_${rawScheduleStart}_${rawScheduleEnd}`
		}).split("_")

		return {
			dayName,
			"scheduleEnd": Number(scheduleEnd),
			"scheduleStart": Number(scheduleStart),
			"userID": (await this.#user()).id
		}
	}

	dayName(generator: () => Day): EmployeeScheduleFactory {
		this.#dayName = generator
		return this
	}

	scheduleStart(generator: () => number): EmployeeScheduleFactory {
		this.#scheduleStart = generator
		return this
	}

	scheduleEnd(generator: (scheduleStart: number) => number): EmployeeScheduleFactory {
		this.#scheduleEnd = generator
		return this
	}

	user(generator: () => Promise<User>): EmployeeScheduleFactory {
		this.#user = generator
		return this
	}
}
