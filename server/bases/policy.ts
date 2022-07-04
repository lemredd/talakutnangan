import { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

/**
 * Base class for policies.
 *
 * Policies are expected to throw error if the user is not authorized.
 */
export default abstract class extends Middleware {
	abstract authorize(request: Request): Promise<void>

	async intermediate(request: Request, _response: Response, next: NextFunction): Promise<void> {
		return await this.authorize(request).then(next).catch(next)
	}
}
