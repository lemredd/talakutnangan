import { Request, Response, NextFunction, RequestHandler } from "express"

import { Route, RawRoute } from "!/types"
import Middleware from "!/routes/bases/middleware"

export default abstract class extends Middleware {
	constructor() {
		super()
	}

	/**
	 * Returns the configuration where to access the controller
	 */
	abstract getRawRoute(): RawRoute

	/**
	 * Handles the request mainly
	 */
	abstract handle(request: Request, response: Response): Promise<void>

	/**
	 * Returns the middlewares to be used before that handle will execute.
	 */
	protected getPremiddlewares(): Middleware[] {
		return []
	}

	/**
	 * Returns the middlewares to be used after the handle executed.
	 */
	protected getPostmiddlewares(): Middleware[] {
		return []
	}

	intermediate(request: Request, response: Response, next: NextFunction): void {
		this.handle(request, response).then(next)
	}

	generateRoute(prefix: string|null = null): Route {
		const { method, baseURL, overridesPrefix = false } = this.getRawRoute()
		const URL = (
			overridesPrefix || prefix === "/" || prefix === null
			? baseURL
			: `${prefix}/${baseURL}`
		)

		const handlers = this.flattenHandlers(this.getPremiddlewares())

		const postmiddlewares = this.getPostmiddlewares()

		if (postmiddlewares.length === 0) {
			handlers.push(this.handle.bind(this))
		} else {
			handlers.push(this.intermediate.bind(this))

			for (const postHandler of (this.flattenHandlers(postmiddlewares))) {
				handlers.push(postHandler)
			}
		}

		return {
			method,
			URL,
			handlers
		}
	}

	protected flattenHandlers(middlewares: Middleware[]): RequestHandler[] {
		const handlers = []

		for (const middleware of middlewares) {
			const subhandlers = middleware.generateHandlers()

			for(const subhandler of subhandlers) {
				handlers.push(subhandler)
			}
		}

		return handlers
	}
}
