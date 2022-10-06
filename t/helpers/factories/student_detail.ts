import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	StudentDetailResourceIdentifier,
	StudentDetailAttributes,
	DeserializedStudentDetailResource,
	DeserializedStudentDetailDocument,
	DeserializedStudentDetailListDocument,
	StudentDetailResource,
	StudentDetailDocument,
	StudentDetailListDocument
} from "$/types/documents/student_detail"

import { faker } from "@faker-js/faker"

import User from "%/models/user"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import StudentDetail from "%/models/student_detail"
import StudentDetailTransformer from "%/transformers/student_detail"

export default class StudentDetailFactory extends BaseFactory<
	StudentDetail,
	StudentDetailResourceIdentifier<"read">,
	StudentDetailAttributes<"serialized">,
	StudentDetailAttributes<"deserialized">,
	StudentDetailResource,
	DeserializedStudentDetailResource,
	StudentDetailDocument,
	StudentDetailListDocument,
	DeserializedStudentDetailDocument,
	DeserializedStudentDetailListDocument
> {
	#user: () => Promise<User> = async() => await new UserFactory().insertOne()
	#studentNumber: () => string = () => `${faker.random.numeric(4)}-${faker.random.numeric(4)}`

	get model(): ModelCtor<StudentDetail> { return StudentDetail }

	get transformer(): StudentDetailTransformer { return new StudentDetailTransformer() }

	async generate(): GeneratedData<StudentDetail> {
		return {
			"studentNumber": this.#studentNumber(),
			"userID": (await this.#user()).id
		}
	}

	studentNumber(generator: () => string): StudentDetailFactory {
		this.#studentNumber = generator
		return this
	}

	user(generator: () => Promise<User>): StudentDetailFactory {
		this.#user = generator
		return this
	}
}
