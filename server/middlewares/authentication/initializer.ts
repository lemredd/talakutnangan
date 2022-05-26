import Middleware from "!/helpers/middleware"
import passport from "passport"
import type { Request, Response, NextFunction, RequestHandler } from "express"

export default class extends Middleware {
	protected intermediate(request: Request, response: Response, next: NextFunction): void {}

	generateHandlers(): RequestHandler[] {
		return [
			passport.initialize(),

			// Disable middleware below if application is not using persistent log in.
			// See README in https://github.com/jaredhanson/passport
			passport.session()
		]
	}
}
