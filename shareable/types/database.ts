/**
 * @module IndependentDatabaseTypes
 * @description This module contains types originally used in database and do not depend from other
 * packages. However, they can be used by other parts of the repository.
 */
import type { Serializable } from "$/types/general"
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

/**
 * Shape of expected common filter options
 */
export type CommonFilter = ExistenceFilter

export type UserFilter =
	& CommonFilter
	& DepartmentFilter
	& RoleFilter
	& KindFilter
	& SlugFilter

export interface ExistenceFilter extends Serializable {
	filter: {
		existence: "exists" | "archived" | "*"
	}
}

export interface SlugFilter extends Serializable {
	filter: {
		slug: string
	}
}

export interface DepartmentFilter extends Serializable {
	filter: {
		department: "*"|string
	}
}

export interface RoleFilter extends Serializable {
	filter: {
		role: "*"|string
	}
}

export interface KindFilter extends Serializable {
	filter: {
		kind: "*"|UserKind
	}
}

export interface CriteriaFilter extends Serializable {
	filter: {
		criteria: "*"|"incomplete"|"verified"|"unverified"
	}
}

/**
 * Expected shape of the common sort options
 */
export interface Sort extends Serializable {
	sort: string[]
}

/**
 * Expected shape of the common page options
 */
export interface Page {
	page: {
		offset: number,
		limit: number
	}
}

export type CommonQueryParameters =
	& Page
	& Sort
	& CommonFilter
