import { Request, Response, NextFunction } from "express"
import Middleware from "!/bases/middleware"

export default abstract class extends Middleware {
	abstract mayAllow(request: Request): boolean

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		if (this.mayAllow(request)) {
			next()
		} else {
			response.status(this.status.UNAUTHORIZED)

			response.json({
				errors: [
					"User is not allowed to invoke the functionality."
				]
			})
		}
	}
}
