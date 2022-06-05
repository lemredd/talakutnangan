import { Request, Response, NextFunction } from "express"
import Middleware from "!/bases/middleware"

export default abstract class extends Middleware {
	abstract mayAllow(request: Request): boolean

	intermediate(request: Request, response: Response, next: NextFunction): void {
		if (this.mayAllow(request)) {
			response.status(this.status.UNAUTHORIZED)

			response.json({
				errors: [
					"User is not allowed to invoke th functionality."
				]
			})
		} else {
			next()
		}
	}
}
