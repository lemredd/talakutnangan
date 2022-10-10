import type { GeneralObject } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"

import deserialize from "$/object/deserialize"
import PermissionGroup from "$/permissions/base"
import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "!/policies/authentication-based"

/**
 * Creates middleware to only allow certain users base from permissions.
 *
 * Automatically requires user to be authenticated.
 */
export default class <
	T extends GeneralObject<number>,
	U,
	V extends AuthenticatedRequest = AuthenticatedRequest
> extends AuthenticationBasedPolicy {
	private permissionCombinations: U[][]
	protected readonly permissionGroup: PermissionGroup<T, U>
	private checkOthers: (request: V) => Promise<void>

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 * @param permissionCombinations Permission combinations which only allows permitted users.
	 * @param checkOthers Extra function used for checking other constraints.
	 */
	constructor(
		permissionGroup: PermissionGroup<T, U>,
		permissionCombinations: U[][],
		checkOthers: (request: V) => Promise<void> = (): Promise<void> => {
			const promise = Promise.resolve()
			return promise
		}
	) {
		super(true)
		this.permissionGroup = permissionGroup
		this.permissionCombinations = permissionCombinations
		this.checkOthers = checkOthers
	}

	async authorize(request: V): Promise<void> {
		await super.authorize(request)

		const user = deserialize(request.user) as DeserializedUserDocument
		const roles = user.data.roles.data as unknown as T[]
		const isPermitted = this.permissionGroup.hasOneRoleAllowed(roles, this.permissionCombinations)

		if (!isPermitted) {
			throw new AuthorizationError("None of the roles of the user can invoke the action.")
		}

		await this.checkOthers(request)
	}
}
