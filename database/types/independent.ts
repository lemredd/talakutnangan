/**
 * @module DatabaseIndependentTypes
 * @description This module exports types that are independent from any third-party packages.
 */

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

export interface RawUser {
	name?: string,
	email?: string,
	password?: string,
	kind?: UserKind,
	emailVerifiedAt?: Date|null,
	admittedAt?: Date|null,
	signature?: Buffer|null
}

export const rawCriteria = [ "incomplete", "complete", "all" ]

export type Criteria = typeof rawCriteria[number]

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

export type List<T> = Promise<{
	records: T[],
	count: number
}>

export type Pipe<T> = (currentState: T, constraints: object) => T
