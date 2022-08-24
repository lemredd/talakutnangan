import { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

/**
 * Base class for request filters.
 *
 * Request filters only use the request for vlidation, policies, logging, and others and guarantees
 * not to respond. If there are errors encountered, they will be thrown.
 */
export default abstract class extends Middleware {
	abstract filterRequest(request: Request): Promise<void>

	async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
	: Promise<void> {
		return await this.filterRequest(request).then(() => next()).catch(next)
	}
}
