import { Request, Response, NextFunction, RequestHandler } from "express"

import type { Route } from "!/types"
import RequestEnvironment from "!/helpers/request_environment";

/**
 * Base middleware that is being used to organize the routing information of routes
 */
export default abstract class {
	protected const environment: RequestEnvironment = RequestEnvironment.current

	abstract private intermediate(request: Request, response: Response, next: NextFunction): void

	generateHandlers(): RequestHandler[] { return [ this.intermediate ] }

	generateRoute(URL: string): Route {
		const handlers = this.generateHandler()

		return {
			URL,
			handlers
		}
	}
}
