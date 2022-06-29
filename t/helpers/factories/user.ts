import dataURIToBuffer from "data-uri-to-buffer"
import type { MimeBuffer } from "data-uri-to-buffer"
import { faker } from "@faker-js/faker"

import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"

import User from "%/models/user"
import Role from "%/models/role"
import hash from "!/helpers/auth/hash"
import BaseFactory from "~/factories/base"
import Department from "%/models/department"
import AttachedRole from "%/models/attached_role"
import DepartmentFactory from "~/factories/department"

export default class UserFactory extends BaseFactory<User> {
	nameGenerator = () => faker.name.findName()
	emailGenerator = () => faker.internet.exampleEmail()
	roles: Role[] = []

	#password = "password"
	#signature: MimeBuffer|null = dataURIToBuffer(faker.image.dataUri())
	#kind = "student"
	#mustBeVerified = true
	#department: Department|null = null

	get model(): ModelCtor<User> { return User }

	async generate(): GeneratedData<User> {
		if (this.#department === null) {
			this.#department = await (new DepartmentFactory()).insertOne()
		}

		return {
			name: this.nameGenerator(),
			email: this.emailGenerator(),
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
		await AttachedRole.bulkCreate(this.roles.map(role => {
			return {
				userID: user.id,
				roleID: role.id
			}
		}))
		user.roles = this.roles

		return user
	}

	async makeMany(count: number): Promise<User[]> {
		const users = await super.makeMany(count)
		users.forEach(user => user.password = this.#password)
		return users
	}

	async insertMany(count: number): Promise<User[]> {
		const users = await super.insertMany(count)

		for (const user of users) {
			user.password = this.#password

			await AttachedRole.bulkCreate(this.roles.map(role => {
				return {
					userID: user.id,
					roleID: role.id
				}
			}))

			user.roles = this.roles
		}

		return users
	}

	name(generator: () => string): UserFactory {
		this.nameGenerator = generator
		return this
	}

	email(generator: () => string): UserFactory {
		this.emailGenerator = generator
		return this
	}

	notVerified(): UserFactory {
		this.#mustBeVerified = false
		return this
	}

	beStudent(): UserFactory {
		this.#kind = "student"
		return this
	}

	beReachableEmployee(): UserFactory {
		this.#kind = "reachable_employee"
		return this
	}

	beUnreachableEmployee(): UserFactory {
		this.#kind = "unreachable_employee"
		return this
	}

	hasNoSignature(): UserFactory {
		this.#signature = null
		return this
	}

	in(department: Department): UserFactory {
		this.#department = department
		return this
	}

	attach(role: Role): UserFactory {
		this.roles.push(role)
		return this
	}
}
