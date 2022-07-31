/**
 * @module IndependentServerTypes
 * @description This module contains types originally used in database and do not depend from other
 * packages. However, they can be used by other parts of the repository.
 */

/**
 * Used to indicate the type of current environment where the script is running.
 */
export enum Environment {
	Production,
	Development,
	UnitTest,
	IntegrationTest
}

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

/**
 * Type to combine with `Request` type to do registration
 */
export interface WithRegistration {
	body: {
		email: string,
		password: string,
		kind?: "unreachable employee" | "reachable employee" | "student"
	}
}

import type { Serializable } from "$/types/general"

export interface PageProps extends Serializable {
	// Added to pass data from server to client
	userProfile: Serializable|null
}

/**
 * Errors output by the server
 */
export interface UnitError {
	status: number,
	code: string,
	title: string,
	detail: string,
	meta?: Serializable
	source?: SourcePointer|SourceParameter
}

/**
 * Source of error in the sent resource
 */
export interface SourcePointer extends Serializable {
	pointer: string
}

/**
 * Source of error in the parameter
 */
export interface SourceParameter extends Serializable {
	parameter: string
}


// Media types used in the application
export const HTML_MEDIA_TYPE = "text/html"
export const JSON_MEDIA_TYPE = "application/json"
export const MULTIPART_MEDIA_TYPE = "multipart/form-data"
export const JSON_API_MEDIA_TYPE = "application/vnd.api+json"
