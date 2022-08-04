import { deserialise } from "kitsu-core"
import type { AuthenticatedRequest } from "!/types/dependent"

import PermissionGroup from "$/permissions/base"
import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "!/policies/authentication-based"

/**
 * Creates middleware to only allow certain kind of user.
 *
 * Automatically requires user to be authenticated.
 */
export default class<T extends { [key:string]: number }, U> extends AuthenticationBasedPolicy {
	private permissionCombinations: U[][]
	private permissionGroup: PermissionGroup<T, U>
	private checkOthers: (request: AuthenticatedRequest) => Promise<void>

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 */
	constructor(
		permissionGroup: PermissionGroup<T, U>,
		permissionCombinations: U[][],
		checkOthers: (request: AuthenticatedRequest) => Promise<void> = async() => {}
	) {
		super(true)
		this.permissionGroup = permissionGroup
		this.permissionCombinations = permissionCombinations
		this.checkOthers = checkOthers
	}

	async authorize(request: AuthenticatedRequest): Promise<void> {
		await super.authorize(request)

		const user = deserialise(request.user)
		const roles = user?.data?.roles?.data
		const isPermitted = this.permissionGroup.hasOneRoleAllowed(roles, this.permissionCombinations)

		if (!isPermitted) {
			throw new AuthorizationError("None of the roles of the user can invoke the action.")
		}

		await this.checkOthers(request)
	}
}
