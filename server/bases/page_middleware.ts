import { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import ControllerLike from "!/bases/controller-like"

export default abstract class extends ControllerLike {
	/**
	 * Returns the middleware that will enhance a certain page route. It is treated as the main
	 * handler.
	 */
	abstract get middleware(): Middleware

	get endHandler(): null { return null }

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		return this.middleware.intermediate(request, response, next)
	}
}
