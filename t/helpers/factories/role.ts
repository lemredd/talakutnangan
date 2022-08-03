import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	RoleResourceIdentifier,
	RoleAttributes,
	DeserializedRoleResource,
	DeserializedRoleDocument,
	DeserializedRoleListDocument
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
	RoleAttributes,
	DeserializedRoleResource,
	DeserializedRoleDocument,
	DeserializedRoleListDocument
> {
	#name: () => string = () => faker.name.jobTitle()
	#departmentFlags: number = 0
	#roleFlags: number = 0
	#semesterFlags: number = 0
	#tagFlags: number = 0
	#postFlags: number = 0
	#commentFlags: number = 0
	#profanityFlags: number = 0
	#userFlags: number = 0
	#auditTrailFlags: number = 0

	get model(): ModelCtor<Role> { return Role }

	get transformer(): RoleTransformer { return new RoleTransformer() }

	async generate(): GeneratedData<Role> {
		return {
			name: this.#name(),
			departmentFlags: this.#departmentFlags,
			roleFlags: this.#roleFlags,
			semesterFlags: this.#semesterFlags,
			tagFlags: this.#tagFlags,
			postFlags: this.#postFlags,
			commentFlags: this.#commentFlags,
			profanityFlags: this.#profanityFlags,
			userFlags: this.#userFlags,
			auditTrailFlags: this.#auditTrailFlags
		}
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
