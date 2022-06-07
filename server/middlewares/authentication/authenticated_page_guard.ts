import Middleware from "!/bases/middleware";

import type { UserKind } from "%/types"
import type { Request, Response, NextFunction } from "!/types/dependent"

/**
 * Creates middleware to only allow authenticated users.
 *
 * @param kind Kind of user that may be permitted. Use `null` to allow any authenticated user.
 */
export default class extends Middleware {
	private kind: UserKind|null

	constructor(kind: UserKind|null) {
		super()
		this.kind = kind
	}

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// TODO: Add user kind in the model
		if (request.user === null || (this.kind !== null && true /** Replace to kind property **/)) {
			response.status(this.status.UNAUTHORIZED).json({
				errors: [
					"You are not allowed to go to that page."
				]
			})
		} else {
			next()
		}
	}
}
