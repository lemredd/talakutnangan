import { faker } from "@faker-js/faker"

import { Day } from "$/types/database"
import { days } from "$/types/database.native"
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

import User from "%/models/user"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import EmployeeSchedule from "%/models/employee_schedule"
import EmployeeScheduleTransformer from "%/transformers/employee_schedule"

export default class EmployeeScheduleFactory extends BaseFactory<
	EmployeeSchedule,
	EmployeeScheduleResourceIdentifier,
	EmployeeScheduleAttributes,
	EmployeeScheduleResource,
	DeserializedEmployeeScheduleResource,
	EmployeeScheduleDocument,
	EmployeeScheduleListDocument,
	DeserializedEmployeeScheduleDocument,
	DeserializedEmployeeScheduleListDocument
> {
	#user: () => Promise<User> = async() => await new UserFactory().insertOne()
	#day: () => Day = () => faker.helpers.arrayElement(days)
	#scheduleStart: () => number = () => faker.datatype.number({ "max": 24 * 60 - 2 })
	#scheduleEnd: (scheduleStart: number) => number
		= (scheduleStart: number) => faker.datatype.number({
			"min": scheduleStart + 1,
			"max": 24 * 60 - 1
		})

	get model(): ModelCtor<EmployeeSchedule> { return EmployeeSchedule }

	get transformer(): EmployeeScheduleTransformer { return new EmployeeScheduleTransformer() }

	async generate(): GeneratedData<EmployeeSchedule> {
		const [ day, scheduleStart, scheduleEnd ] = faker.unique(() => {
			const rawDay = this.#day()
			const rawScheduleStart = this.#scheduleStart()
			const rawScheduleEnd = this.#scheduleEnd(rawScheduleStart)

			return `${rawDay}_${rawScheduleStart}_${rawScheduleEnd}`
		}).split("_")

		return {
			day,
			scheduleEnd,
			scheduleStart,
			"userID": (await this.#user()).id
		}
	}

	day(generator: () => Day): EmployeeScheduleFactory {
		this.#day = generator
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
