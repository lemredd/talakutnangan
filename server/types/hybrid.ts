/**
 * @module HybridTypes
 * @description This module contains types that depend on both independent and dependent types.
 */

import type { Response, Request, RequestHandler } from "!/types/dependent"
import type { RouteInformation, WithRegistration, OptionalMiddleware } from "!/types/independent"

export type EndHandler = (_request: Request, _response: Response) => Promise<void> | void

/**
 * Used to structure the stored route information with its associated handlers.
 */
 export interface RouteHandlers {
	middlewares: OptionalMiddleware[],
	controller: RequestHandler,
	postJobs: OptionalMiddleware[],
	endHandler: EndHandler | null
}

export interface UsableRoute {
	information: RouteInformation,
	handlers: RouteHandlers
}

export type RequestWithRegistration = Request & WithRegistration
