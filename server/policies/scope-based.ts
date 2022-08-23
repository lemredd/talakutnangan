import type { GeneralObject } from "$/types/general"
import type { AuthenticatedIDRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"

import deserialize from "$/helpers/deserialize"
import PermissionGroup from "$/permissions/base"
import AuthorizationError from "$!/errors/authorization"
import PermissionBasedPolicy from "!/policies/permission-based"

/**
 * Creates middleware to only allow certain users base from permissions that has different scopes.
 *
 * Assumes there is a binded ID which indicates the user ID.
 *
 * Automatically requires user to be authenticated.
 */
export default class <
	T extends GeneralObject<number>,
	U,
	V extends AuthenticatedIDRequest = AuthenticatedIDRequest
> extends PermissionBasedPolicy<T, U, V> {
	private wideScopePermissionCombinations: U[][]

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 * @param narrowScopePermissionCombination Permission combination which only allows current user.
	 * @param wideScopePermissionCombinations Permission combinations which may allow heads or admin.
	 * @param checkOthers Extra function used for checking other constraints.
	 */
	constructor(
		permissionGroup: PermissionGroup<T, U>,
		narrowScopePermissionCombination: U[],
		wideScopePermissionCombinations: U[][],
		checkOthers: (request: V) => Promise<void> = (): Promise<void> => {
			const promise = Promise.resolve()
			return promise
		}
	) {
		super(
			permissionGroup,
			[ narrowScopePermissionCombination, ...wideScopePermissionCombinations ],
			async(request: V): Promise<void> => {
				await this.checkLimitation(request)
				await checkOthers(request)
			}
		)

		this.wideScopePermissionCombinations = wideScopePermissionCombinations
	}

	checkLimitation(request: V): Promise<void> {
		const user = deserialize(request.user) as DeserializedUserDocument
		const roles = user.data.roles.data as unknown as T[]
		const hasWidePermission = this.permissionGroup.hasOneRoleAllowed(
			roles,
			this.wideScopePermissionCombinations
		)

		// TODO: Check for department-wide scope
		if (!hasWidePermission) {
			if (user.data.id !== request.params.id) {
				return Promise.reject(new AuthorizationError(
					"There is no sufficient permission to invoke action for others."
				))
			}
		}

		return Promise.resolve()
	}
}
