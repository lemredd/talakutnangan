/**
 * @module IndependentDatabaseTypes
 * @description This module contains types originally used in database and do not depend from other
 * packages. However, they can be used by other parts of the repository.
 */

export const UserKindValues = [ "unreachable_employee", "reachable_employee", "student" ] as const

/**
 * Possible kinds of user that the system can handle
 */
export type UserKind = typeof UserKindValues[number]

/**
 * Type of databases this application can handle
 */
export type SourceType = "pgsql" | "mysql" | "memoried_sqlite" | "filed_sqlite" | "unit_test"

export interface RawUser {
	name?: string,
	email?: string,
	password?: string,
	kind?: UserKind,
	emailVerifiedAt?: Date|null,
	admittedAt?: Date|null,
	signature?: Buffer|null
}
/**
 * Used to receive raw posts. //title, desc, badword, user id, role id
 */

export interface RawPost {
	user?: string,
	title?: string,
	desc?: string
	badWordExist?: boolean,
	userID?: User,
	roleID?: Role,
}

/**
 * Used to receive raw validated department details.
 */
export interface RawDepartment {
	fullName: string,
	acronym: string,
	mayAdmit: boolean
}

/**
 * Used to receive raw validated role details.
 */
export interface RawRole {
	name: string,
	departmentFlags: number,
	roleFlags: number,
	semesterFlags: number,
	tagFlags: number,
	postFlags: number,
	commentFlags: number,
	profanityFlags: number,
	userFlags: number,
	auditTrailFlags: number
}

/**
 * Used to receive raw signature details.
 */
export interface RawSignature {
	userID: string,
	signature: Buffer
}

export type List<T> = Promise<{
	records: T[],
	count: number
}>

export type CommonConstraints = {
	page?: number,
	[key: string]: any
}

export type Pipe<T, U> = (currentState: T, constraints: U) => T

/**
 * Used to indicate that a variable is serializable into a specific data format.
 */
export interface Serializable {
	[key: string]:
		| string
		| string[]
		| number
		| number[]
		| boolean
		| boolean[]
		| null
		| Serializable[]
		| Serializable
}

/**
 * Used as part of user profile data to be returned to client.
 */
export interface Role extends RawRole, Serializable {}

import { days } from "$/types/database.native"
import User from "%/models/user"

const rawDays = [ ...days ] as const
export type Day = typeof rawDays[number]

/**
 * Expected shape of the common page options
 */
export interface Page {
	page: {
		offset: number,
		limit: number
	}
}

/**
 * Shape of expected common filter options
 */
export type Filter = ExistenceFilter

export type UserFilter =
	& Filter
	& DepartmentFilter
	& RoleFilter
	& KindFilter
	& SlugFilter

export interface ExistenceFilter extends Serializable {
	filter: {
		existence: "exists" | "archived" | "*"
	}
}

/**
 * Expected shape of the common sort options
 */
export interface Sort extends Serializable {
	sort: string[]
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

/**
 * Expected shape of meta option indicating if the number of users associated to the entity should
 * be counted.
 */
export interface CountUser extends Serializable {
	meta: {
		countUser: boolean
	}
}
