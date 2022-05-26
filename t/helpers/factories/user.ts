import { faker } from "@faker-js/faker"
import User from "!/models/user"
import Factory from "~/factory"

export default class UserFactory extends Factory<User> {
	constructor() {
		super(User)
	}

	#mustBeVerified = false

	generate() {
		return {
			email: faker.internet.exampleEmail(),
			password: "password",
			emailVerifiedAt: this.#mustBeVerified ? new Date() : null
		}
	}

	verified(): UserFactory {
		this.#mustBeVerified = true
		return this
	}
}
