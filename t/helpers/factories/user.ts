import type { ModelCtor } from "%/types/dependent"
import type { Serializable } from "$/types/general"
import type { GeneratedData } from "~/types/dependent"
import type {
	UserResourceIdentifier,
	UserAttributes,
	DeserializedUserResource,
	DeserializedUserDocument,
	DeserializedUserListDocument,
	UserResource,
	UserDocument,
	UserListDocument
} from "$/types/documents/user"

import { faker } from "@faker-js/faker"

import User from "%/models/user"
import Role from "%/models/role"
import hash from "$!/auth/hash"
import BaseFactory from "~/factories/base"
import Department from "%/models/department"
import UserTransformer from "%/transformers/user"
import AttachedRole from "%/models/attached_role"
import DepartmentFactory from "~/factories/department"
import UserProfileTransformer from "%/transformers/user_profile"

export default class UserFactory extends BaseFactory<
	User,
	UserResourceIdentifier,
	UserAttributes,
	UserResource,
	DeserializedUserResource,
	UserDocument,
	UserListDocument,
	DeserializedUserDocument,
	DeserializedUserListDocument
> {
	nameGenerator = () => faker.name.findName()
	prefersDarkGenerator = () => false
	emailGenerator = () => faker.internet.exampleEmail()
	roles: Role[] = []

	#password = "password"
	#kind = "student"
	#mustBeVerified = true
	#department: Department|null = null

	get model(): ModelCtor<User> { return User }

	get transformer(): UserTransformer { return new UserTransformer() }

	async generate(): GeneratedData<User> {
		if (this.#department === null) {
			this.#department = await new DepartmentFactory().insertOne()
		}

		return {
			"name": this.nameGenerator(),
			"email": this.emailGenerator(),
			"password": await hash(this.#password),
			"emailVerifiedAt": this.#mustBeVerified ? new Date() : null,
			"kind": this.#kind,
			"prefersDark": this.prefersDarkGenerator(),
			"departmentID": this.#department.id,
			"deletedAt": null
		}
	}

	async makeOne() {
		const user = await super.makeOne()
		user.roles = this.roles
		user.department = this.#department!
		user.password = this.#password
		return user
	}

	async insertOne() {
		const user = await super.insertOne()
		user.password = this.#password
		await AttachedRole.bulkCreate(this.roles.map(role => ({
			"userID": user.id,
			"roleID": role.id
		})))
		user.roles = this.roles
		user.department = this.#department!

		return user
	}

	async makeMany(count: number): Promise<User[]> {
		const users = await super.makeMany(count)
		users.forEach(user => {
			user.password = this.#password
		})
		return users
	}

	async insertMany(count: number): Promise<User[]> {
		const users = await super.insertMany(count)

		const pendingAttachments = []
		for (const user of users) {
			user.password = this.#password

			pendingAttachments.push(
				AttachedRole.bulkCreate(
					this.roles.map(role => ({
						"userID": user.id,
						"roleID": role.id
					}))
				)
			)

			user.roles = this.roles
		}

		await Promise.all(pendingAttachments)

		return users
	}

	async insertProfile(): Promise<{ profile: Serializable, password: string }> {
		const user = await this.insertOne()
		const { password } = user
		const profile = this.serialize(user, {}, new UserProfileTransformer())

		return {
			password,
			profile
		}
	}

	name(generator: () => string): UserFactory {
		this.nameGenerator = generator
		return this
	}

	email(generator: () => string): UserFactory {
		this.emailGenerator = generator
		return this
	}

	prefersDark(generator: () => boolean): UserFactory {
		this.prefersDarkGenerator = generator
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

	in(department: Department): UserFactory {
		this.#department = department
		return this
	}

	attach(role: Role): UserFactory {
		this.roles.push(role)
		return this
	}
}
