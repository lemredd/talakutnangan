import { StatusCodes } from "http-status-codes"
import type { RequestHandler, Request, Response, NextFunction } from "express"
import type { WithPossibleUser, UserKind } from "!/types"

/**
 * Creates middleware to only guests.
 *
 * Useful for home page and some authentication forms.
 */
export default function(): RequestHandler {
	return (request: Request & WithPossibleUser, response: Response, next: NextFunction) => {
		if (request.isAuthenticated()) {
			response.status(StatusCodes.UNAUTHORIZED)

			return response.json({
				errors: [
					"You are not allowed to go to that page."
				]
			})
		}

		return next()
	}
}
