import User from "!/models/user"

/**
 * Type of databases this application can handle
 */
export type SourceType = "pgsql" | "mysql" | "memoried_sqlite" | "filed_sqlite" | "test"

export interface WithSession {
	session: {
		token: string|null
	}
}

export interface WithPossibleUser extends WithSession {
	user: User|null
}

export enum UserKind {
	UnreachableEmployee,
	ReachableEmployee,
	Student
}
