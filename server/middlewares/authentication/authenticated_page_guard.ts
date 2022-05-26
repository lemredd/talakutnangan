import { StatusCodes } from "http-status-codes"
import type { RequestHandler, Request, Response, NextFunction } from "express"

import Middleware from "!/helpers/middleware";
import type { WithPossibleUser, UserKind } from "!/types"

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

	intermediate(
		request: Request & WithPossibleUser,
		response: Response,
		next: NextFunction
	): void {
		// TODO: Add user kind in the model
		if (request.user === null || (this.kind !== null && true /** Replace to kind property **/)) {
			response.status(StatusCodes.UNAUTHORIZED).json({
				errors: [
					"You are not allowed to go to that page."
				]
			})
		} else {
			next()
		}
	}
}
