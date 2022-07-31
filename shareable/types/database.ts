/**
 * @module IndependentDatabaseTypes
 * @description This module contains types originally used in database and do not depend from other
 * packages. However, they can be used by other parts of the repository.
 */
import { days } from "$/types/database.native"

export const UserKindValues = [ "unreachable_employee", "reachable_employee", "student" ] as const

/**
 * Possible kinds of user that the system can handle
 */
export type UserKind = typeof UserKindValues[number]

/**
 * Type of databases this application can handle
 */
export type SourceType = "pgsql" | "mysql" | "memoried_sqlite" | "filed_sqlite" | "unit_test"

export type Pipe<T, U> = (currentState: T, constraints: U) => T

const rawDays = [ ...days ] as const
export type Day = typeof rawDays[number]
