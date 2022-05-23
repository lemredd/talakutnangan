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
 * Type returned by the route managers
 */
export interface Routers {
	/**
	 * Routers that can be prefixed by the parent route manager.
	 */
	prefixables: Router[],

	/**
	 * Routers that cannot be prefixed by the parent route manager. They will be based in root route.
	 *
	 * Use the key to indicate the route of the associated router.
	 */
	specials?: { [key: string]: Router }
}

/**
 * Possible kinds of user that the system can handle
 */
export enum UserKind {
	UnreachableEmployee,
	ReachableEmployee,
	Student
}
