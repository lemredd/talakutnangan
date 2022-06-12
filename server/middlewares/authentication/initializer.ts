import passport from "passport"
import type { Request, Response, NextFunction } from "!/types/dependent"
import Middleware from "!/bases/middleware"

export default class Initializer extends Middleware {
	private static intialize = passport.initialize()

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// @ts-ignore
		Initializer.intialize(request, response, next)
	}
}
