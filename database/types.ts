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

import type { FindAndCountOptions, FindOptions, DestroyOptions, RestoreOptions, CreationAttributes, Model, UpdateOptions } from "sequelize"

export type FindOneFunction<T> = (options: FindOptions) => Promise<T|null>

export type FindAndCountFunction<T> = (options: FindAndCountOptions) => Promise<{
	rows: T[],
	count: number
}>

export type CreateFunction<T extends Model, U> = (
	values: U & CreationAttributes<T>
) => Promise<T>

export type UpdateFunction<T extends Model, U> = (
	values: U & CreationAttributes<T>,
	options: UpdateOptions<any>
) => Promise<[ number, T[] ]>

export type DestroyFunction = (options: DestroyOptions<any>) => Promise<number>

export type RestoreFunction = (options: RestoreOptions<any>) => Promise<void>
