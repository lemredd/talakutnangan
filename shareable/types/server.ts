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
 * Used to return as an output by validation methods in non-GET controllers
 */
export interface ValidationError {
	field: string,
	message: string
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

/**
 * Used to define the information about a certain permission.
 */
export interface PermissionInfo<T> {
	flag: number,
	permissionDependencies: T[]
}

/**
 * Used to define a group of permissions.
 */
export type PermissionMap<T> = Map<T, PermissionInfo<T>>

import type Middleware from "!/bases/middleware"

/**
 * Used to indicate which middlewares to use in a route.
 */
export type OptionalMiddleware = Middleware | null

import type { Serializable } from "$/types/general"

export interface PageProps extends Serializable {
	// Added to pass data from server to client
	userProfile: Serializable|null
}

/**
 * Array of permissions that dictate the CRUD operations
 */
export const rawOperationPermissions = [ "view", "create", "update", "archiveAndRestore" ] as const

/**
 * Union of raw operation permissions.
 */
export type OperationPermission = typeof rawOperationPermissions[number]

/**
 * Array of permissions that dictate the administration level of read and write operations.
 */
export const rawLevelPermissions = [
	"readOwnScope",
	"readDepartmentScope",
	"readOverallScope",
	"writeOwnScope",
	"writeDepartmentScope",
	"writeOverallScope"
] as const

/**
 * Union of raw level permissions.
 */
export type LevelPermission = typeof rawLevelPermissions[number]

// Used to set the flag of a common permission prventing errors in the future.
// Special flag(s) of a permission group should have flags > 0x00FF or 0b1100_0000.
export const VIEW							= 0x0001;
export const CREATE						= 0x0002;
export const UPDATE						= 0x0004;
export const ARCHIVE_AND_RESTORE		= 0x0008;
export const READ_OWN_SCOPE			= 0x0010;
export const READ_DEPARTMENT_SCOPE	= 0x0020;
export const READ_OVERALL_SCOPE		= 0x0030;
export const WRITE_OWN_SCOPE			= 0x0040;
export const WRITE_DEPARTMENT_SCOPE	= 0x0080;
export const WRITE_OVERALL_SCOPE		= 0x00C0;

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
