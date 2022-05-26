import { Request, Response, NextFunction, RequestHandler } from "express"

import RequestEnvironment from "!/helpers/request_environment";

/**
 * Base middleware that is being used to organize the routing information of routes
 */
export default abstract class {
	protected environment: RequestEnvironment = RequestEnvironment.current

	protected abstract intermediate(request: Request, response: Response, next: NextFunction): void

	generateHandlers(): RequestHandler[] { return [ this.intermediate.bind(this) ] }
}
