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

		return request.user !== null && kind === null
	}
}
