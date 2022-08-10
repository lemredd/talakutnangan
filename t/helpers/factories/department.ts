import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DeserializedDepartmentResource,
	DeserializedDepartmentDocument,
	DeserializedDepartmentListDocument,
	DepartmentResource,
	DepartmentDocument,
	DepartmentListDocument
} from "$/types/documents/department"

import { faker } from "@faker-js/faker"

import BaseFactory from "~/factories/base"
import Department from "%/models/department"
import DepartmentTransformer from "%/transformers/department"

export default class DepartmentFactory extends BaseFactory<
	Department,
	DepartmentResourceIdentifier,
	DepartmentAttributes,
	DepartmentResource,
	DeserializedDepartmentResource,
	DepartmentDocument,
	DepartmentListDocument,
	DeserializedDepartmentDocument,
	DeserializedDepartmentListDocument
> {
	#name = () => faker.name.firstName()
		+" "+faker.name.firstName()
		+" "+faker.name.middleName()
		+" "+faker.name.lastName()
	#mayAdmit = true

	get model(): ModelCtor<Department> { return Department }

	get transformer(): DepartmentTransformer { return new DepartmentTransformer() }

	async generate(): GeneratedData<Department> {
		const departmentName = this.#name()
			.split(/\s/)
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
