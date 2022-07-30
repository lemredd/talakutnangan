import { faker } from "@faker-js/faker"

import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"

import User from "%/models/user"
import StudentDetail from "%/models/student_detail"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"

export default class SignatureFactory extends BaseFactory<StudentDetail> {
	#user: () => Promise<User>  =  () => new UserFactory().insertOne()
	#studentNumber: () => string = () => `${faker.random.numeric(4)}-${faker.random.numeric(4)}`

	get model(): ModelCtor<StudentDetail> { return StudentDetail }

	async generate(): GeneratedData<StudentDetail> {
		return {
			userID: (await this.#user()).id,
			studentNumber: this.#studentNumber()
		}
	}

	studentNumber(generator: () => string): SignatureFactory {
		this.#studentNumber = generator
		return this
	}

	user(generator: () => Promise<User>): SignatureFactory {
		this.#user = generator
		return this
	}
}
