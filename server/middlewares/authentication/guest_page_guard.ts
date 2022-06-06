import Middleware from "!/bases/middleware";
import { StatusCodes } from "http-status-codes"
import type { RequestHandler, Request, Response, NextFunction } from "express"
import type { WithPossibleUser, UserKind } from "!/types"

/**
 * Creates middleware to guards guest pages against authenticated users.
 *
 * Useful for home page and some authentication forms.
 */
export default class extends Middleware {
	async intermediate(
		request: Request & WithPossibleUser,
		response: Response,
		next: NextFunction
	): Promise<void> {
		if (request.isAuthenticated()) {
			response.status(StatusCodes.UNAUTHORIZED)

			response.json({
				errors: [
					"You are not allowed to go to that page."
				]
			})
		} else {
			next()
		}
	}
}
