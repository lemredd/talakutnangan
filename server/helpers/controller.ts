import { Request, Response, NextFunction,  } from "express"

import { Route } from "!/types"
import Middleware from "!/helpers/middleware"
import RequestEnvironment from "!/helpers/request_environment"

export default abstract class extends Middleware {
	const #premiddlewares: Middleware[] = []
	const #postmiddlewares: Middleware[] = []
	const #overridesPrefix: boolean;
	const #URL: string;

	constructor(URL: string, overridesPrefix: boolean = false) {
		this.#URL = URL;
		this.#overridesPrefix = overridesPrefix;
	}

	abstract #handle(request: Request, response: Response): void

	#intermediate(request: Request, response: Response, next: NextFunction) {
		this.handle(request, response)

		next()
	}

	generateRoute(prefix: string|null = null): Route {
		const URL = this.#overridesPrefix
			? this.#URL
			: `${prefix}/${this.#URL}`

		const handlers = this.#flattenHandlers(this.#premiddlewares)

		if (this.#postmiddlewares.length === 0) {
			handlers.push(this.#handle)
		} else {
			handlers.push(this.#intermediate)

			for (const postHandler of this.this.#flattenHandlers(this.#postmiddlewares)) {
				handlers.push(postHandler)
			}
		}

		return {
			URL,
			handlers
		}
	}

	#flattenHandlers(middlewares: Middleware[]): RequestHandler[] {
		const handlers = []

		for (const middleware of middlewares) {
			const subhandlers = middleware.generateMiddlewareInformation()

			for(const subhandler of subhandlers) {
				handlers.push(subhandler)
			}
		}

		return handlers
	}
}
