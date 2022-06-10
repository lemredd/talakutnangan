import type { Request } from "!/types/dependent"

import PermissionGroup from "!/bases/permission_group"
import AuthenticationBasedPolicy from "!/middlewares/authentication/authentication-based_policy"

/**
 * Creates middleware to only allow certain kind of user.
 *
 * Automatically requires user to be authenticated.
 */
export default class extends AuthenticationBasedPolicy {
	private permissionGroup: PermissionGroup

	/**
	 * @param kind Specific kind of user to only allow.
	 */
	constructor(permissionGroup: PermissionGroup) {
		super(true)
		this.permissionGroup = permissionGroup
	}

	mayAllow(request: Request): boolean {
		// Pass the role of the user
		return super.mayAllow(request)
	}
}
