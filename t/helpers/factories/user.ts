import dataURIToBuffer from "data-uri-to-buffer/src/index"

import hash from "!/helpers/auth/hash"

import User from "%/models/user"
import { faker } from "@faker-js/faker"
import { UserKind } from "%/types"

export default class UserFactory {
	#password = "password"
	#signature = dataURIToBuffer(faker.image.dataUri())
	#kind = UserKind.Student
	#mustBeVerified = true

	async generate() {
		return {
			name: faker.name.findName(),
			email: faker.internet.exampleEmail(),
			password: await hash(this.#password),
			emailVerifiedAt: this.#mustBeVerified ? new Date() : null,
			admittedAt: null,
			kind: this.#kind,
			signature: this.#signature,
			deletedAt: null
		}
	}

	async makeOne() {
		const user = await User.build(await this.generate())
		user.password = this.#password
		return user
	}

	async insertOne() {
		const user = await User.create(await this.generate())
		user.password = this.#password
		return user
	}

	notVerified(): UserFactory {
		this.#mustBeVerified = false
		return this
	}

	beStudent(): UserFactory {
		this.#kind = UserKind.Student
		return this
	}

	beReachableEmployee(): UserFactory {
		this.#kind = UserKind.ReachableEmployee
		return this
	}

	beUnreachableEmployee(): UserFactory {
		this.#kind = UserKind.UnreachableEmployee
		return this
	}

	hasNoSignature(): UserFactory {
		this.#signature = null
		return this
	}
}
