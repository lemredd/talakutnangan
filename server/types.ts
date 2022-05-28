import { Router, RequestHandler } from "express"

import User from "!/models/user"

/**
 * Determines the type of current environment where the script is running
 */
export enum Environment {
	Production,
	Development,
	UnitTest,
	IntegrationTest
}

/**
 * Type of databases this application can handle
 */
export type SourceType = "pgsql" | "mysql" | "memoried_sqlite" | "filed_sqlite" | "unit test"

/**
 * Type to combine with `Request` type to get the session
 */
export interface WithSession {
	session: {
		token: string|null
	}
}

/**
 * Type to combine with `Request` type to get the possible user
 */
export interface WithPossibleUser extends WithSession {
	user: User|null,
	isAuthenticated: () => boolean
}

/**
 * Type to combine with `Request` type to get the authenticated user
 */
export interface WithUser extends WithSession {
	user: User,
	logout: () => void
}

/**
 * Type to combine with `Request` type to do registration
 */
export interface WithRegistration extends WithSession {
	body: {
		email: string,
		password: string,
		kind: "unreachable employee" | "reachable employee" | "student"
	}
}

/**
 * Type returned by the route managers
 */
export interface Routers {
	/**
	 * Router that can be prefixed by the parent route manager.
	 */
	main: Router,

	/**
	 * Router that cannot be prefixed by the parent route manager. It will be based possibly in in
	 * root route.
	 */
	special?: Router
}

/**
 * Possible kinds of user that the system can handle
 */
export enum UserKind {
	UnreachableEmployee = "unreachable_employee",
	ReachableEmployee = "reachable_employee",
	Student = "student"
}

/**
 * List of methods that is supported by `express` package
 */
export type Method = "get" | "post" | "patch" | "delete"

/**
 * Used to information about a certain route and its handlers.
 */
export interface Route {
	method: Method,
	URL: string,
	handlers: RequestHandler[]
}
