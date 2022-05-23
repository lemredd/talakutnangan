import User from "!/models/user"

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
 * Possible kinds of user that the system can handle
 */
export enum UserKind {
	UnreachableEmployee,
	ReachableEmployee,
	Student
}
