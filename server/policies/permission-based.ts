import { deserialise } from "kitsu-core"
import type { AuthenticatedRequest } from "!/types/dependent"

import PermissionGroup from "$/permissions/base"
import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "!/policies/authentication-based"

/**
 * Creates middleware to only allow certain users base from permissions.
 *
 * Automatically requires user to be authenticated.
 */
export default class <
	T extends { [key:string]: number },
	U,
	V extends AuthenticatedRequest = AuthenticatedRequest
> extends AuthenticationBasedPolicy {
	private permissionCombinations: U[][]
	protected readonly permissionGroup: PermissionGroup<T, U>
	private checkOthers: (request: V) => Promise<void>

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
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

		const user = deserialise(request.user)
		const roles = user?.data?.roles?.data
		const isPermitted = this.permissionGroup.hasOneRoleAllowed(roles, this.permissionCombinations)

		if (!isPermitted) {
			throw new AuthorizationError("None of the roles of the user can invoke the action.")
		}

		await this.checkOthers(request)
	}
}
