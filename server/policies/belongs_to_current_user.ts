import type { BaseManagerClass } from "!/types/independent"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import isUndefined from "$/type_guards/is_undefined"
import deserialize from "$/object/deserialize"
import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "!/policies/authentication-based"

/**
 * Creates a policy to limit the operation to the owner of the resource only.
 *
 * Requires that the resource represented by `id` parameter is owned by the current logged in user.
 *
 * Hint: If the resource can be processed by other users through advance permissions, do not use
 * the policy.
 */
export default class extends AuthenticationBasedPolicy {
	private readonly Class: BaseManagerClass

	constructor(managerClass: BaseManagerClass) {
		super(true)

		this.Class = managerClass
	}

	async authorize(request: AuthenticatedRequest): Promise<void> {
		await super.authorize(request)

		if (isUndefined(request.params.id)) {
			throw new AuthorizationError("Resource ID should be provided.")
		}

		const user = deserialize(request.user) as DeserializedUserProfile
		const manager = new this.Class(request.transaction, request.cache)
		if (!await manager.isModelBelongsTo(
			Number(request.params.id),
			Number(user.data.id),
			manager.modelChainToUser
		)) {
			throw new AuthorizationError("Only the owner of the resource can do the operation.")
		}
	}
}
