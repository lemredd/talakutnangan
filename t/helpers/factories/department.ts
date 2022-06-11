import { faker } from "@faker-js/faker"
import Department from "%/models/department"

export default class DepartmentFactory {
	#mayAdmit = true

	async generate() {
		const departmentName = faker.random.words()
		return {
			fullName: departmentName,
			acronym: departmentName.split(" ").map(name => name.slice(0, 1)).join(""),
			mayAdmit: this.#mayAdmit
		}
	}

	async makeOne() {
		const department = await Department.build(await this.generate())
		return department
	}

	async insertOne() {
		const department = await Department.create(await this.generate())
		return department
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
