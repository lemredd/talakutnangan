/**
 * @module HybridServerTypes
 * @description This module contains types that depend on both independent and dependent types.
 */

import type { FieldRules } from "!/types/validation"
import type { OptionalMiddleware, RedirectInfo } from "!/types/independent"
import type { RouteInformation, PageProps, DocumentProps } from "$/types/server"
import type { Response, Request, NextFunction, RequestHandler } from "!/types/dependent"

export interface PageRequest extends Request {
	// Added to pass data from server to client
	pageProps: PageProps

	// TODO: Require in v0.15.0
	documentProps?: DocumentProps
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

/**
 * Interface of function to create the rules.
 */
export type FieldRulesMaker<T = any> = (request: T) => FieldRules

/**
 * Interface of function to create redirect info
 */
export type RedirectInfoMaker<T extends Request> = (request: T) => Promise<RedirectInfo|null>
