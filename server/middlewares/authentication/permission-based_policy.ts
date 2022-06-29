import { deserialise } from "kitsu-core"
import type { Serializable } from "$/types/database"
import type { AuthenticatedRequest } from "!/types/dependent"

import PermissionGroup from "$/permissions/base"
import AuthenticationBasedPolicy from "!/middlewares/authentication/authentication-based_policy"

/**
 * Creates middleware to only allow certain kind of user.
 *
 * Automatically requires user to be authenticated.
 */
export default class<T extends { [key:string]: number }, U> extends AuthenticationBasedPolicy {
	private permissions: U[]
	private permissionGroup: PermissionGroup<T, U>

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 */
	constructor(permissionGroup: PermissionGroup<T, U>, permissions: U[]) {
		super(true)
		this.permissions = permissions
		this.permissionGroup = permissionGroup
	}

	mayAllow(request: AuthenticatedRequest): boolean {
		const user = deserialise(request.user)
		const roles = user.data.roles.data
		return super.mayAllow(request)
			&& roles.reduce((previousPermission: boolean, role: Serializable) => {
				return previousPermission || this.permissionGroup.mayAllow(
					role as T,
					...this.permissions)
			}, false)
	}
}
