import Middleware from "!/bases/middleware"
import type { Request, Response, NextFunction } from "!/types/dependent"

/**
 * Creates middleware to guards guest pages against authenticated users.
 *
 * Useful for home page and some authentication forms.
 */
export default class extends Middleware {
	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		if (request.isAuthenticated()) {
			response.status(this.status.UNAUTHORIZED)

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
