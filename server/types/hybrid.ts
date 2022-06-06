/**
 * @module HybridTypes
 * @description This module contains types that depend on both independent and dependent types.
 */

import type Middleware from "!/bases/middleware"
import type { RequestHandler } from "!/types/dependent"

/**
 * Used to structure the stored route information with its associated handlers.
 */
 export interface RouteHandlers {
	middlewares: Middleware[],
	controller: RequestHandler,
	postJobs: Middleware[]
}
