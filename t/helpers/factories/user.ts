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
import convertForSentence from "$/string/convert_for_sentence"
import UserProfileTransformer from "%/transformers/user_profile"

export default class UserFactory extends BaseFactory<
	User,
	UserResourceIdentifier,
	UserAttributes<"serialized">,
	UserAttributes<"deserialized">,
	UserResource,
	DeserializedUserResource,
	UserDocument,
	UserListDocument,
	DeserializedUserDocument,
	DeserializedUserListDocument
> {
	nameGenerator = () => `${
		convertForSentence(faker.random.alpha(faker.mersenne.rand(10, 5)))
	} ${
		convertForSentence(faker.random.alpha(faker.mersenne.rand(10, 7)))
	}`

	prefersDarkGenerator = () => false
	emailGenerator = () => faker.internet.exampleEmail()
	roles: Role[] = []
	private passwordGenerator = () => "password"

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
			"deletedAt": null,
			"departmentID": this.#department.id,
			"email": this.emailGenerator(),
			"emailVerifiedAt": this.#mustBeVerified ? new Date() : null,
			"kind": this.#kind,
			"name": this.nameGenerator(),
			"password": await hash(this.passwordGenerator()),
			"prefersDark": this.prefersDarkGenerator()
		}
	}

	async attachRelatedModels(user: User): Promise<User> {
		if (user.id) {
			await AttachedRole.bulkCreate(this.roles.map(role => ({
				"roleID": role.id,
				"userID": user.id
			})))
		}
		user.roles = this.roles
		user.department = this.#department as Department
		user.password = this.passwordGenerator()

		return user
	}

	async insertProfile(): Promise<{ profile: Serializable, password: string }> {
		const user = await this.insertOne()
		const { password } = user
		const profile = this.serialize(user, {} as unknown as void, new UserProfileTransformer())

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

	password(generator: () => string): UserFactory {
		this.passwordGenerator = generator
		return this
	}
}
