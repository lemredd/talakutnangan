import passport from "passport"
import type { Request, Response, NextFunction } from "!/types/dependent"
import Middleware from "!/bases/middleware"

export default class Session extends Middleware {
	private static session = passport.session()

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		Session.session(request, response, next)
	}
}
