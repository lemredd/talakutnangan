import type { GeneralObject } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"

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
	private readOwnerInfo: (request: V) => Promise<DeserializedUserDocument>

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
		readOwnerInfo: (request: V) => Promise<DeserializedUserDocument>,
		checkOthers: (request: V) => Promise<void> = (): Promise<void> => {
			const promise = Promise.resolve()
			return promise
		}
	) {
		super(
			permissionGroup,
			[
				personalPermissionCombination,
				socialPermissionCombination,
				publicPermissionCombination
			],
			async(request: V): Promise<void> => {
				await this.checkLimitation(request)
				await checkOthers(request)
			}
		)

		this.socialPermissionCombination = socialPermissionCombination
		this.publicPermissionCombination = publicPermissionCombination
		this.readOwnerInfo = readOwnerInfo
	}

	async checkLimitation(request: V): Promise<void> {
		const user = deserialize(request.user) as DeserializedUserDocument<"roles">
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
				if (!hasSocialPermission) {
					return Promise.reject(new AuthorizationError(
						"There is no sufficient permission to invoke action for others."
					))
				}
			}
		}

		return Promise.resolve()
	}
}
