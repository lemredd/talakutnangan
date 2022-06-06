/**
 * @module IndependentTypes
 * @description This module contains types that do not depend from other packages and can be used by
 * other parts of the repository. However, they are placed here to indicate where they originate.
 */

/**
 * List of methods that is supported by `express` package
 */
export type Method = "get" | "post" | "patch" | "delete"

/**
 * Used to indicate the purpose of a certain registered custom route.
 *
 * Here are the meanings of the following values:
 * - "api". Route is used as REST API.
 * - "enhancer". Route is used to enhance to the view route it is associated.
 * - "dev". Route is used for development.
 */
export type Purpose = "api" | "enhancer" | "dev"

/**
 * Used to provide route information to be used by server routers.
 */
export interface RouteInformation {
	method: Method,
	path: string,
	purpose: Purpose,
	description: string|null
}

import type Policy from "!/bases/policy"
import type Middleware from "!/bases/middleware"
import type Validation from "!/bases/validation"

/**
 * Used to structure the stored route information with its associated handlers.
 */
 export interface RouteHandlers {
	middlewares: Middleware[],
	policy: Policy,
	validation: Validation,
	postJobs: Middleware[]
}
