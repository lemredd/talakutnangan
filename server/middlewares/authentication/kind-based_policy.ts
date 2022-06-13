import type { UserKind } from "%/types"
import type { AuthenticatedRequest } from "!/types/dependent"

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

	mayAllow(request: AuthenticatedRequest): boolean {
		return super.mayAllow(request) && request.user.kind === this.kind
	}
}
