import { deserialise } from "kitsu-core"
import type { AuthenticatedRequest } from "!/types/dependent"

import PermissionGroup from "$/permissions/base"
import AuthorizationError from "$!/errors/authorization"
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

	async authorize(request: AuthenticatedRequest): Promise<void> {
		await super.authorize(request)

		const user = deserialise(request.user)
		const roles = user?.data?.roles?.data
		const isPermitted = this.permissionCombinations
				.reduce((previousPermittedCombination: boolean, combination: U[]) => {
					// Use logical OR to match one of the roles of the user
					return previousPermittedCombination || roles.reduce((
						previousPermittedRole: boolean,
						role: T
					) => {
						// Use logical OR to match one of the permission combinations
						return previousPermittedRole
							|| this.permissionGroup.mayAllow(role, ...combination)
					}, false)
			}, false)

		if (!isPermitted) {
			throw new AuthorizationError("None of the roles of the user can invoke the action.")
		}
	}
}
