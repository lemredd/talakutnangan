import type { GeneralObject } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { AdvanceAuthenticationOptions } from "!/types/independent"

import deserialize from "$/object/deserialize"
import PermissionGroup from "$/permissions/base"
import AuthorizationError from "$!/errors/authorization"
import PermissionBasedPolicy from "!/policies/permission-based"

/**
 * Creates middleware to only allow certain users base from permissions that has different scopes.
 *
 * Automatically requires user to be authenticated.
 */
export default class <
	T extends GeneralObject<number>,
	U,
	V extends AuthenticatedRequest = AuthenticatedRequest
> extends PermissionBasedPolicy<T, U, V> {
	private socialPermissionCombination: U[]
	private publicPermissionCombination: U[]
	private readOwnerInfo: (request: V) => Promise<DeserializedUserDocument<"roles"|"department">>

	/**
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 * @param personalPermissionCombination Permission combination which only allows current user.
	 * @param socialPermissionCombination Permission combination which may allow department heads.
	 * @param publicPermissionCombination Permission combinations which may allow admin.
	 * @param readOwnerInfo Callback to get the owner of the resource to edit.
	 * @param checkOthers Extra function used for checking other constraints.
	 */
	constructor(
		permissionGroup: PermissionGroup<T, U>,
		personalPermissionCombination: U[],
		socialPermissionCombination: U[],
		publicPermissionCombination: U[],
		readOwnerInfo: (request: V) => Promise<DeserializedUserDocument<"roles"|"department">>,
		{
			checkOthers = (): Promise<void> => {
				const promise = Promise.resolve()
				return promise
			},
			...otherOptions
		}: Partial<AdvanceAuthenticationOptions<V>> = {}
	) {
		super(
			permissionGroup,
			[
				personalPermissionCombination,
				socialPermissionCombination,
				publicPermissionCombination
			],
			{
				"checkOthers": async(request: V): Promise<void> => {
					await this.checkLimitation(request)
					await checkOthers(request)
				},
				...otherOptions
			}
		)

		this.socialPermissionCombination = socialPermissionCombination
		this.publicPermissionCombination = publicPermissionCombination
		this.readOwnerInfo = readOwnerInfo
	}

	async checkLimitation(request: V): Promise<void> {
		const user = deserialize(request.user) as DeserializedUserDocument<"roles"|"department">
		const roles = user.data.roles.data as unknown as T[]
		const hasPublicPermission = this.permissionGroup.hasOneRoleAllowed(
			roles,
			[ this.publicPermissionCombination ]
		)

		if (!hasPublicPermission) {
			const owner = await this.readOwnerInfo(request)

			if (user.data.id !== owner.data.id) {
				const hasSocialPermission = this.permissionGroup.hasOneRoleAllowed(
					roles,
					[ this.socialPermissionCombination ]
				)
				if (
					!hasSocialPermission
					|| user.data.department.data.id !== owner.data.department.data.id
				) {
					return Promise.reject(new AuthorizationError(
						"There is no sufficient permission to invoke action for others."
					))
				}
			}
		}

		return Promise.resolve()
	}
}
