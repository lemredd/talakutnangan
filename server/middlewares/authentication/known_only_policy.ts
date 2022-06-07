import type { UserKind } from "%/types"
import type { Request } from "!/types/dependent"

import Policy from "!/bases/policy"

/**
 * Creates middleware to only allow authenticated users.
 *
 * @param kind Kind of user that may be permitted. Use `null` to allow any authenticated user.
 */
export default class extends Policy {
	private kind: UserKind|null

	constructor(kind: UserKind|null) {
		super()
		this.kind = kind
	}

	mayAllow(request: Request): boolean {
		return request.isAuthenticated() && (
			request.user.kind === this.kind
		) || this.kind !== null
	}
}
