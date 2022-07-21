import { EndHandler } from "!/types/hybrid"
import { Request, Response, NextFunction } from "!/types/dependent"

import endRequest from "!/helpers/end_request"
import ControllerLike from "!/bases/controller-like"

/**
 * Base class for controllers which accept JSON as their request body.
 */
export default abstract class extends ControllerLike {
	/**
	 * Handles the request mainly.
	 */
	abstract handle(request: Request, response: Response): Promise<void>

	get endHandler(): EndHandler { return endRequest }

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		return this.handle(request, response).then(() => this.respond(next)).catch(next)
	}

	private respond(next: NextFunction): void {
		return next()
	}
}
