import User from "!/models/user"
import { Router } from "express"

/**
 * Type of databases this application can handle
 */
export type SourceType = "pgsql" | "mysql" | "memoried_sqlite" | "filed_sqlite" | "test"

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
	user: User|null
}

/**
 * Type to combine with `Request` type to get the authenticated user
 */
export interface WithUser extends WithSession {
	user: User,
	logout: () => void
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
	UnreachableEmployee,
	ReachableEmployee,
	Student
}
