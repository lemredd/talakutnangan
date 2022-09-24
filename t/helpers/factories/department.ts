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
import convertForSentence from "$/string/convert_for_sentence"

export default class DepartmentFactory extends BaseFactory<
	Department,
	DepartmentResourceIdentifier,
	DepartmentAttributes<"serialized">,
	DepartmentAttributes<"deserialized">,
	DepartmentResource,
	DeserializedDepartmentResource,
	DepartmentDocument,
	DepartmentListDocument,
	DeserializedDepartmentDocument,
	DeserializedDepartmentListDocument
> {
	#fullName = () => `${
		convertForSentence(faker.random.alpha(10))
	} ${
		convertForSentence(faker.random.alpha(10))
	}`

	#mayAdmit = true

	get model(): ModelCtor<Department> { return Department }

	get transformer(): DepartmentTransformer { return new DepartmentTransformer() }

	generate(): GeneratedData<Department> {
		const departmentName = this.#fullName()
		.split(/\s/u)
		.map(fullName => fullName.slice(0, 1).toLocaleUpperCase() + fullName.slice(1))
		.join(" ")
		return Promise.resolve({
			"acronym": departmentName.split(" ").map(fullName => fullName.slice(0, 1)).join(""),
			"fullName": departmentName,
			"mayAdmit": this.#mayAdmit
		})
	}

	fullName(fullName: () => string): DepartmentFactory {
		this.#fullName = fullName
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
