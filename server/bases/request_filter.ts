import { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

/**
 * Base class for request filters.
 *
 * Request filters only use the request for vlidation, policies, logging, and others and guarantees
 * not to respond. If there are errors encountered, they should be thrown.
 */
export default abstract class extends Middleware {
	abstract filterRequest(request: Request): Promise<void>

	protected async runFilter(
		filter: (request: Request, response: Response, next: NextFunction) => void,
		request: Request
	): Promise<void> {
		await new Promise<void>((resolve, reject) => {
			filter(request, {} as Response, (error?: any) => {
				if (error) reject(error)
				resolve()
			})
		})
	}

	async intermediate(request: Request, unusedResponse: Response, next: NextFunction)
	: Promise<void> {
		try {
			await this.filterRequest(request)
			next()
		} catch (error) {
			next(error)
		}
	}
}
