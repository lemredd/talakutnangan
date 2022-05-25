import { Request, Response, NextFunction, RequestHandler } from "express"
import RequestEnvironment from "!/helpers/request_environment";
import type { Route } from "!/types"

/**
 * Base middleware that is being used to organize the routing information of routes
 */
export default abstract class {
	private const environment: RequestEnvironment = RequestEnvironment.current

	abstract private intermediate(request: Request, response: Response, next: NextFunction): void

	generateHandler(): RequestHandler[] { return [ this.intermediate ] }

	generateRoute(URL: string): Route {
		const handlers = this.generateHandler()

		return {
			URL,
			handlers
		}
	}
}
