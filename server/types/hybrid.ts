/**
 * @module HybridTypes
 * @description This module contains types that depend on both independent and dependent types.
 */

import type { Response, Request, NextFunction, RequestHandler } from "!/types/dependent"
import type {
	RouteInformation,
	WithRegistration,
	OptionalMiddleware,
	PageProps
} from "!/types/independent"

export interface PageRequest extends Request {
	// Added to pass data from server to client
	clientPayload: PageProps|null
}

export interface AsynchronousRequestHandler {
	(
		_request: Request,
		_response: Response,
		_next: NextFunction
	): Promise<void>
}
export type EndHandler = (_request: Request, _response: Response) => Promise<void> | void

/**
 * Used to structure the stored route information with its associated handlers.
 */
 export interface RouteHandlers {
	middlewares: OptionalMiddleware[],
	controller: RequestHandler | AsynchronousRequestHandler,
	postJobs: OptionalMiddleware[],
	endHandler: EndHandler | null
}

export interface UsableRoute {
	information: RouteInformation,
	handlers: RouteHandlers
}

export type RequestWithRegistration = Request & WithRegistration
