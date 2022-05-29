import dataURIToBuffer from "data-uri-to-buffer/src/index"
import { faker } from "@faker-js/faker"
import User from "!/models/user"
import Factory from "~/factory"

export default class UserFactory extends Factory<User> {
	constructor() {
		super(User)
	}

	#signature = dataURIToBuffer(faker.image.dataUri())
	#kind = "student"
	#mustBeVerified = false

	generate() {
		return {
			email: faker.internet.exampleEmail(),
			password: "password",
			emailVerifiedAt: this.#mustBeVerified ? new Date() : null,
			kind: this.#kind,
			signature: this.#signature
		}
	}

	verified(): UserFactory {
		this.#mustBeVerified = true
		return this
	}

	beReachableEmployee(): UserFactory {
		this.#kind = "reachable_emplyee"
		return this
	}

	beUnreachableEmployee(): UserFactory {
		this.#kind = "unreachable_emplyee"
		return this
	}

	hasNoSignature(): UserFactory {
		this.#signature = null
		return this
	}
}
