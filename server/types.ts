/**
 * Type of databases this application can handle
 */
export type SourceType = "pgsql" | "mysql" | "memoried_sqlite" | "filed_sqlite" | "test"

export interface Request {}

export interface Response {
	statusCode: number
	end: () => void
}
