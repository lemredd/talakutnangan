import type { Request } from "!/types/dependent"

import PermissionGroup from "!/bases/permission_group"
import AuthenticationBasedPolicy from "!/middlewares/authentication/authentication-based_policy"

/**
 * Creates middleware to only allow certain kind of user.
 *
 * Automatically requires user to be authenticated.
 */
export default class<T extends { [key:string]: number }, U> extends AuthenticationBasedPolicy {
	private permissionGroup: PermissionGroup<T, U>

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 */
	constructor(permissionGroup: PermissionGroup<T, U>) {
		super(true)
		this.permissionGroup = permissionGroup
	}

	mayAllow(request: Request): boolean {
		// TODO: Pass the role of the user
		return super.mayAllow(request)
			// && request.user.roles
			// 	.reduce((previousPermission, role) => {
			// 		return this.permissionGroup.mayAllow(role, this.permission)
			// 	})
	}
}
