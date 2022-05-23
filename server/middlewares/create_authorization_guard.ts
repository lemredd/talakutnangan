import { StatusCodes } from "http-status-codes"
import type { RequestHandler, Request, Response, NextFunction } from "express"
import type { WithPossibleUser, UserKind } from "!/types"

/**
 * Creates middleware to only allow authenticated users.
 *
 * @param kind Kind of user that may be permitted. Use `null` to allow any authenticated user.
 */
export default function(kind: UserKind|null): RequestHandler {
	return (request: Request & WithPossibleUser, response: Response, next: NextFunction) => {
		// TODO: Add user kind in the model
		if (request.user === null || (kind !== null && true /** Replace true to kind property **/)) {
			return response.status(StatusCodes.UNAUTHORIZED).json({
				errors: [
					"You are not allowed to go to that page."
				]
			})
		}

		return next()
	}
}
