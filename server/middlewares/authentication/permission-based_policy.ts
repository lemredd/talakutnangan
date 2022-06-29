import { deserialise } from "kitsu-core"
import type { AuthenticatedRequest } from "!/types/dependent"

import PermissionGroup from "$/permissions/base"
import AuthenticationBasedPolicy from "!/middlewares/authentication/authentication-based_policy"

/**
 * Creates middleware to only allow certain kind of user.
 *
 * Automatically requires user to be authenticated.
 */
export default class<T extends { [key:string]: number }, U> extends AuthenticationBasedPolicy {
	private permissionCombinations: U[][]
	private permissionGroup: PermissionGroup<T, U>

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 */
	constructor(permissionGroup: PermissionGroup<T, U>, permissionCombinations: U[][]) {
		super(true)
		this.permissionGroup = permissionGroup
		this.permissionCombinations = permissionCombinations
	}

	mayAllow(request: AuthenticatedRequest): boolean {
		const user = deserialise(request.user)
		const roles = user?.data?.roles?.data
		return super.mayAllow(request)
			&& roles.reduce((previousPermittedRole: boolean, role: T) => {
				// Use logical OR to match one of the permission combinations
				return previousPermittedRole || this.permissionCombinations.reduce((
						previousPermission: boolean,
						combination: U[]
					) => {
						// Use logical AND to match every of the permissions in the combination
						return previousPermission && this.permissionGroup.mayAllow(role, ...combination)
					}, true)
			}, false)
	}
}
