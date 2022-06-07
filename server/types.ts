import User from "%/models/user"

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
 * Possible kinds of user that the system can handle
 */
export enum UserKind {
	UnreachableEmployee = "unreachable_employee",
	ReachableEmployee = "reachable_employee",
	Student = "student"
}

/**
 * Mostly-based on `TableColumnOptions` where name and type is optional.
 */
export interface PartialTableColumnOptions {
	name?: string,
	type?: string,
	default?: any,
	isNullable?: boolean,
	isGenerated?: boolean,
	generationStrategy?: "uuid" | "increment",
	isPrimary?: boolean,
	isUnique?: boolean,
	length?: string,
	precision?: number | null,
	scale?: number,
	enum?: string[]
}
