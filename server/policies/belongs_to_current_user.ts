import type { GeneralObject } from "$/types/general"
import type { BaseManagerClass } from "!/types/dependent"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import deserialize from "$/object/deserialize"
import PermissionGroup from "$/permissions/base"
import isUndefined from "$/type_guards/is_undefined"
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
export default class <
	T extends GeneralObject<number>,
	U,
	V extends AuthenticatedRequest = AuthenticatedRequest
> extends AuthenticationBasedPolicy {
	private readonly Class: BaseManagerClass
	private permissionGroup: PermissionGroup<T, U>|undefined
	private permissionCombinations: U[][]|undefined
	private checkOthers: (request: V) => Promise<void>

	constructor(
		managerClass: BaseManagerClass,
		{
			bypassNecessarilyWith,
			checkOthers = (): Promise<void> => {
				const promise = Promise.resolve()
				return promise
			}
		}: Partial<{
			bypassNecessarilyWith: {
				group: PermissionGroup<T, U>,
				combinations: U[][]
			},
			checkOthers: (request: V) => Promise<void>
		}> = {}
	) {
		super(true)

		this.Class = managerClass
		this.permissionGroup = bypassNecessarilyWith?.group
		this.permissionCombinations = bypassNecessarilyWith?.combinations
		this.checkOthers = checkOthers
	}

	async authorize(request: V): Promise<void> {
		await super.authorize(request)

		if (isUndefined(request.params.id)) {
			throw new AuthorizationError("Resource ID should be provided.")
		}

		const user = deserialize(request.user) as DeserializedUserProfile<"roles">
		const manager = new this.Class(request)
		if (!await manager.isModelBelongsTo(
			Number(request.params.id),
			Number(user.data.id),
			manager.modelChainToUser
		)) {
			let isPermitted = false

			if (!isUndefined(this.permissionGroup) && !isUndefined(this.permissionCombinations)) {
				const roles = user.data.roles.data as unknown as T[]
				isPermitted = this.permissionGroup.hasOneRoleAllowed(
					roles,
					this.permissionCombinations
				)
			}

			if (!isPermitted) {
				throw new AuthorizationError("Only the owner of the resource can do the operation.")
			}
		}

		await this.checkOthers(request)
	}
}
