/**
 * @module IndependentDatabaseTypes
 * @description This module contains types originally used in database and do not depend from other
 * packages. However, they can be used by other parts of the repository.
 */

export const DayValues = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday"
] as const

export const UserKindValues = [ "unreachable_employee", "reachable_employee", "student" ] as const

export const StatusValues = [ "will_start", "ongoing", "done" ]

export const OrderValues = [ "first", "second", "third" ] as const

export const VoteKindValues = [ "upvote", "downvote" ] as const
/**
 * Possible kinds of user that the system can handle
 */
export type UserKind = typeof UserKindValues[number]

export type Status = typeof StatusValues[number]

export type Order = typeof OrderValues[number]

export type VoteKind = typeof VoteKindValues[number]

/**
 * Type of databases this application can handle
 */
export type SourceType = "pgsql" | "mysql" | "memoried_sqlite" | "filed_sqlite" | "unit_test"

export type Pipe<T, U> = (currentState: T, constraints: U) => T

export type Day = typeof DayValues[number]
