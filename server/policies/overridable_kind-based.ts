import type { UserKind } from "$/types/database"
import type { GeneralObject } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserDocument } from "$/types/documents/user"

import deserialize from "$/object/deserialize"
import PermissionGroup from "$/permissions/base"
import AuthorizationError from "$!/errors/authorization"
import KindBasedPolicy from "!/policies/kind-based"

/**
 * Creates middleware to only allow certain users base from permissions that has different scopes.
 *
 * Automatically requires user to be authenticated.
 */
export default class <
	T extends GeneralObject<number>,
	U,
	V extends AuthenticatedRequest = AuthenticatedRequest
> extends KindBasedPolicy {
	private permissionGroup: PermissionGroup<T, U>
	private socialPermissionCombination: U[]
	private publicPermissionCombination: U[]

	private checkOthersAfterPermission: (request: V) => Promise<void>

	/**
	 * @param targetKinds Specific kinds which can access the route.
	 * @param permissionGroup Specific permission which will dictate if user is allowed or not.
	 * @param socialPermissionCombination Permission combination which may allow department heads.
	 * @param publicPermissionCombination Permission combinations which may allow admin.
	 * @param checkOthers Extra function used for checking other constraints.
	 */
	constructor(
		targetKinds: UserKind[],
		permissionGroup: PermissionGroup<T, U>,
		socialPermissionCombination: U[],
		publicPermissionCombination: U[],
		checkOthers: (request: V) => Promise<void> = (): Promise<void> => {
			const promise = Promise.resolve()
			return promise
		}
	) {
		super(targetKinds)

		this.permissionGroup = permissionGroup
		this.socialPermissionCombination = socialPermissionCombination
		this.publicPermissionCombination = publicPermissionCombination
		this.checkOthersAfterPermission = checkOthers
	}

	async authorize(request: V): Promise<void> {
		try {
			await super.authorize(request)
		} catch (error) {
			await this.checkLimitation(request)
			await this.checkOthersAfterPermission(request)
		}
	}

	checkLimitation(request: V): Promise<void> {
		const user = deserialize(request.user) as DeserializedUserDocument<"roles"|"department">
		const roles = user.data.roles.data as unknown as T[]
		const hasPublicPermission = this.permissionGroup.hasOneRoleAllowed(
			roles,
			[ this.publicPermissionCombination ]
		)

		if (!hasPublicPermission) {
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

		return Promise.resolve()
	}
}
