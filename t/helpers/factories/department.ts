import { faker } from "@faker-js/faker"

import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"

import BaseFactory from "~/factories/base"
import Department from "%/models/department"

export default class DepartmentFactory extends BaseFactory<Department> {
	#name = () => faker.random.words(3)
	#mayAdmit = true

	get model(): ModelCtor<Department> { return Department }

	async generate(): GeneratedData<Department> {
		const departmentName = this.#name()
			.split(" ")
			.map(name => name.slice(0, 1).toLocaleUpperCase() + name.slice(1))
			.join(" ")
		return {
			fullName: departmentName,
			acronym: departmentName.split(" ").map(name => name.slice(0, 1)).join(""),
			mayAdmit: this.#mayAdmit
		}
	}

	name(name: () => string): DepartmentFactory {
		this.#name = name
		return this
	}

	mayAdmit(): DepartmentFactory {
		this.#mayAdmit = true
		return this
	}

	mayNotAdmit(): DepartmentFactory {
		this.#mayAdmit = false
		return this
	}
}
