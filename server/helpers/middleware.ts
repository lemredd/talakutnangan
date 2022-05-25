import { Request, Response, NextFunction, RequestHandler } from "express"
import RequestEnvironment from "./request_environment";

/**
 * Base middleware that is being used to organize the routing information of routes
 */
export default abstract class {
	const environment: RequestEnvironment = RequestEnvironment.current

	abstract #intermediate(request: Request, response: Response, next: NextFunction): void

	generateMiddlewareInformation(): RequestHandler[] { return [ this.#intermediate ] }
}
