import dataURIToBuffer from "data-uri-to-buffer/src/index"
import { faker } from "@faker-js/faker"
import User from "%/models/user"

export default class UserFactory {
	#signature = dataURIToBuffer(faker.image.dataUri())
	#kind = "student"
	#mustBeVerified = false

	generate() {
		return {
			name: faker.name.findName(),
			email: faker.internet.exampleEmail(),
			password: "password",
			emailVerifiedAt: this.#mustBeVerified ? new Date() : null,
			admittedAt: null,
			kind: this.#kind,
			signature: this.#signature,
			deletedAt: null
		}
	}

	async makeOne() {
		return await User.build(this.generate())
	}

	async insertOne() {
		return await User.create(this.generate())
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
