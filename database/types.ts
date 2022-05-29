export const UserKindValues = [ "unreachable_employee", "reachable_employee", "student" ]

/**
 * Possible kinds of user that the system can handle
 */
export enum UserKind {
	UnreachableEmployee = "unreachable_employee",
	ReachableEmployee = "reachable_employee",
	Student = "student"
}

/**
 * Type of databases this application can handle
 */
 export type SourceType = "pgsql" | "mysql" | "memoried_sqlite" | "filed_sqlite" | "unit_test"
