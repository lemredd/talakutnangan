import passport from "passport"
import type { Request, Response, NextFunction } from "express"
import Middleware from "!/bases/middleware"

export default class Initializer extends Middleware {
	private static intialize = passport.initialize()

	intermediate(request: Request, response: Response, next: NextFunction): void {
		Initializer.intialize(request, response, next)
	}
}
