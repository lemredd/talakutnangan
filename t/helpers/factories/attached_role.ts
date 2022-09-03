/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { ModelCtor } from "%/types/dependent"
import type { GeneratedData } from "~/types/dependent"
import type {
	AttachedRoleResourceIdentifier,
	AttachedRoleAttributes,
	DeserializedAttachedRoleResource,
	DeserializedAttachedRoleDocument,
	DeserializedAttachedRoleListDocument,
	AttachedRoleResource,
	AttachedRoleDocument,
	AttachedRoleListDocument
} from "$/types/documents/attached_role"

import User from "%/models/user"
import Role from "%/models/role"
import UserFactory from "~/factories/user"
import BaseFactory from "~/factories/base"
import RoleFactory from "~/factories/role"
import AttachedRole from "%/models/attached_role"
import AttachedRoleTransformer from "%/transformers/attached_role"

export default class AttachedRoleFactory extends BaseFactory<
	AttachedRole,
	AttachedRoleResourceIdentifier<"read">,
	AttachedRoleAttributes<"serialized">,
	AttachedRoleAttributes<"deserialized">,
	AttachedRoleResource,
	DeserializedAttachedRoleResource,
	AttachedRoleDocument,
	AttachedRoleListDocument,
	DeserializedAttachedRoleDocument,
	DeserializedAttachedRoleListDocument
> {
	#userGenerator: () => Promise<User> = async() => await new UserFactory().insertOne()
	#roleGenerator: () => Promise<Role>
		= async() => await new RoleFactory().insertOne()

	get model(): ModelCtor<AttachedRole> { return AttachedRole }

	get transformer(): AttachedRoleTransformer { return new AttachedRoleTransformer() }

	async generate(): GeneratedData<AttachedRole> {
		return {
			"roleID": (await this.#roleGenerator()).id,
			"userID": (await this.#userGenerator()).id
		}
	}

	async attachRelatedModels(model: AttachedRole): Promise<AttachedRole> {
		model.role = await Role.findByPk(model.roleID) as Role
		model.user = await User.findByPk(model.userID) as User

		return model
	}

	user(generator: () => Promise<User>): AttachedRoleFactory {
		this.#userGenerator = generator
		return this
	}

	role(generator: () => Promise<Role>): AttachedRoleFactory {
		this.#roleGenerator = generator
		return this
	}
}
