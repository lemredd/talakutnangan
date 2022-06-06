/**
 * @module HybridTypes
 * @description This module contains types that depend on both independent and dependent types.
 */

import type Middleware from "!/bases/middleware"
import type { Response, Request, RequestHandler } from "!/types/dependent"

export type EndHandler = (Request, Response) => Promise<void>

/**
 * Used to structure the stored route information with its associated handlers.
 */
 export interface RouteHandlers {
	middlewares: Middleware[],
	controllerAsMiddleware: RequestHandler,
	controllerAsEnd: EndHandler,
	postJobs: Middleware[]
}
