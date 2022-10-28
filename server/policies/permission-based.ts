import type { GeneralObject } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { RedirectableAuthenticationOptions } from "!/types/independent"

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
	private failedRedirectURL: string|null

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 * @param permissionCombinations Permission combinations which only allows permitted users.
	 * @param checkOthers Extra function used for checking other constraints.
	 */
	constructor(
		permissionGroup: PermissionGroup<T, U>,
		permissionCombinations: U[][],
		{
			checkOthers = (): Promise<void> => {
				const promise = Promise.resolve()
				return promise
			},
			failedRedirectURL = null,
			...otherAuthenticationOptions
		}: Partial<RedirectableAuthenticationOptions<V>> = {}
	) {
		super(true, otherAuthenticationOptions)
		this.permissionGroup = permissionGroup
		this.permissionCombinations = permissionCombinations
		this.checkOthers = checkOthers
		this.failedRedirectURL = failedRedirectURL
	}

	async authorize(request: V): Promise<void> {
		await super.authorize(request)

		const user = deserialize(request.user) as DeserializedUserDocument<"roles">
		const roles = user.data.roles.data as unknown as T[]
		const isPermitted = this.permissionGroup.hasOneRoleAllowed(roles, this.permissionCombinations)

		if (!isPermitted) {
			throw new AuthorizationError(
				"None of the roles of the user can invoke the action.",
				this.failedRedirectURL
			)
		}

		await this.checkOthers(request)
	}
}
