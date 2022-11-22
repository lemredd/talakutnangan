import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	RoleResourceIdentifier,
	RoleAttributes,
	DeserializedRoleResource,
	DeserializedRoleDocument,
	DeserializedRoleListDocument,
	RoleResource,
	RoleDocument,
	RoleListDocument
} from "$/types/documents/role"

import { faker } from "@faker-js/faker"

import Role from "%/models/role"
import BaseFactory from "~/factories/base"
import RoleTransformer from "%/transformers/role"
import {
	tag,
	role,
	user,
	post,
	comment,
	semester,
	profanity,
	department,
	auditTrail
} from "$/permissions/permission_list"

export default class RoleFactory extends BaseFactory<
	Role,
	RoleResourceIdentifier,
	RoleAttributes<"serialized">,
	RoleAttributes<"deserialized">,
	RoleResource,
	DeserializedRoleResource,
	RoleDocument,
	RoleListDocument,
	DeserializedRoleDocument,
	DeserializedRoleListDocument
> {
	#name: () => string = () => faker.name.jobTitle()
	#departmentFlags = 0
	#roleFlags = 0
	#semesterFlags = 0
	#tagFlags = 0
	#postFlags = 0
	#commentFlags = 0
	#profanityFlags = 0
	#userFlags = 0
	#auditTrailFlags = 0

	get model(): ModelCtor<Role> { return Role }

	get transformer(): RoleTransformer { return new RoleTransformer() }

	generate(): GeneratedData<Role> {
		return Promise.resolve({
			"auditTrailFlags": this.#auditTrailFlags,
			"commentFlags": this.#commentFlags,
			"departmentFlags": this.#departmentFlags,
			"name": this.#name(),
			"postFlags": this.#postFlags,
			"profanityFlags": this.#profanityFlags,
			"roleFlags": this.#roleFlags,
			"semesterFlags": this.#semesterFlags,
			"tagFlags": this.#tagFlags,
			"userFlags": this.#userFlags
		})
	}

	name(name: () => string): RoleFactory {
		this.#name = name
		return this
	}

	departmentFlags(flags: number): RoleFactory {
		this.#departmentFlags = flags
		return this
	}

	roleFlags(flags: number): RoleFactory {
		this.#roleFlags = flags
		return this
	}

	semesterFlags(flags: number): RoleFactory {
		this.#semesterFlags = flags
		return this
	}

	tagFlags(flags: number): RoleFactory {
		this.#tagFlags = flags
		return this
	}

	postFlags(flags: number): RoleFactory {
		this.#postFlags = flags
		return this
	}

	commentFlags(flags: number): RoleFactory {
		this.#commentFlags = flags
		return this
	}

	profanityFlags(flags: number): RoleFactory {
		this.#profanityFlags = flags
		return this
	}

	userFlags(flags: number): RoleFactory {
		this.#userFlags = flags
		return this
	}

	auditTrailFlags(flags: number): RoleFactory {
		this.#auditTrailFlags = flags
		return this
	}

	superRole(): RoleFactory {
		return this
		.tagFlags(tag.generateSuperMask())
		.roleFlags(role.generateSuperMask())
		.userFlags(user.generateSuperMask())
		.postFlags(post.generateSuperMask())
		.commentFlags(comment.generateSuperMask())
		.semesterFlags(semester.generateSuperMask())
		.profanityFlags(profanity.generateSuperMask())
		.departmentFlags(department.generateSuperMask())
		.auditTrailFlags(auditTrail.generateSuperMask())
	}
}
