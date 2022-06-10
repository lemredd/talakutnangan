/**
 * @module HybridTypes
 * @description This module contains types that depend on both independent and dependent types.
 */

import type Middleware from "!/bases/middleware"
import type { RouteInformation, WithRegistration } from "!/types/independent"
import type { Response, Request, RequestHandler } from "!/types/dependent"

export type EndHandler = (Request, Response) => Promise<void>

/**
 * Used to structure the stored route information with its associated handlers.
 */
 export interface RouteHandlers {
	middlewares: Middleware[],
	controller: RequestHandler,
	postJobs: Middleware[]
}

export interface UsableRoute {
	information: RouteInformation,
	handlers: RouteHandlers
}

export type RequestWithRegistration = Request & WithRegistration
