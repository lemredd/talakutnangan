import { deserialise } from "kitsu-core"
import type { UserKind } from "$/types/database"
import type { AuthenticatedRequest } from "!/types/dependent"

import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "!/middlewares/authentication/authentication-based_policy"

/**
 * Creates middleware to only allow certain kind of user.
 *
 * Automatically requires user to be authenticated.
 */
export default class extends AuthenticationBasedPolicy {
	private kind: UserKind

	/**
	 * @param kind Specific kind of user to only allow.
	 */
	constructor(kind: UserKind) {
		super(true)
		this.kind = kind
	}

	async authorize(request: AuthenticatedRequest): Promise<void> {
		await super.authorize(request)

		const user = deserialise(request.user)
		const kind = user?.data?.kind
		// @ts-ignore
		if(kind !== this.kind) {
			throw new AuthorizationError("Correct user kind can invoke the action.")
		}
	}
}
