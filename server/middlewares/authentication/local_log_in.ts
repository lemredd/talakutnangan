import passport from "passport"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

export default class LocalLogIn extends Middleware {
	private static authenticate = passport.authenticate("local", {
		"failureMessage": true
	})

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		const authenticate = async(resolver: (error?: Error) => void) => {
			LocalLogIn.authenticate(request, response, resolver)
			// Error since resolve was not called
			await request.transaction?.destroyIneffectually()
			/*
			 * TODO: Investigate why going to next error handler does not work
			 * reject(new Error())
			 */
		}

		try {
			await new Promise<void>((resolve, reject) => {
				authenticate((error?: Error) => {
					if (error) reject(error)
					resolve()
				})
			})
			next()
		} catch (error) {
			next(error)
		}
	}
}
