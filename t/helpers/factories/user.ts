import dataURIToBuffer from "data-uri-to-buffer/src/index"
import type { MimeBuffer } from "data-uri-to-buffer"
import { faker } from "@faker-js/faker"

import { UserKind } from "%/types/independent"
import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"

import User from "%/models/user"
import hash from "!/helpers/auth/hash"
import BaseFactory from "~/factories/base"
import Department from "%/models/department"
import DepartmentFactory from "~/factories/department"

export default class UserFactory extends BaseFactory<User> {
	nameGenerator = () => faker.name.findName()
	#password = "password"
	#signature: MimeBuffer|null = dataURIToBuffer(faker.image.dataUri())
	#kind = UserKind.Student
	#mustBeVerified = true
	#department: Department|null = null

	get model(): ModelCtor<User> { return User }

	async generate(): GeneratedData<User> {
		if (this.#department === null) {
			this.#department = await (new DepartmentFactory()).insertOne()
		}

		return {
			name: this.nameGenerator(),
			email: faker.internet.exampleEmail(),
			password: await hash(this.#password),
			emailVerifiedAt: this.#mustBeVerified ? new Date() : null,
			admittedAt: null,
			kind: this.#kind,
			signature: this.#signature,
			departmentID: this.#department.id,
			deletedAt: null
		}
	}

	async makeOne() {
		const user = await super.makeOne()
		user.password = this.#password
		return user
	}

	async insertOne() {
		const user = await super.insertOne()
		user.password = this.#password
		return user
	}

	async makeMany(count: number): Promise<User[]> {
		const users = await super.makeMany(count)
		users.forEach(user => user.password = this.#password)
		return users
	}

	async insertMany(count: number): Promise<User[]> {
		const users = await super.insertMany(count)
		users.forEach(user => user.password = this.#password)
		return users
	}

	setNameGenerator(generator: () => string): UserFactory {
		this.nameGenerator = generator
		return this
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

	in(department: Department) {
		this.#department = department
		return this
	}
}
