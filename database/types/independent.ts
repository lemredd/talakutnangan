/**
 * @module IndependentDatabaseSpecificTypes
 * @description This module contains types used only in database and do not depend from other
 * packages.
 */

import type { Day } from "$/types/database"
import type { Serializable } from "$/types/general"

/**
 * Common shape to expect for creating profiles in bulk
 */
export interface CommonRawBulkData extends Serializable {
	name: string,
	email: string,
	department: string,
	password: string,
	prefersDark: false
}

/**
 * Shape to expect for creating student profiles in bulk
 */
export interface RawBulkDataForStudent extends CommonRawBulkData {
	studentNumber: string
}

/**
 * Shape to expect for creating employee profiles in bulk
 */
export type RawBulkDataForEmployee = CommonRawBulkData

/**
 * Shape to expect for creating students profiles in bulk
 */
export interface RawBulkDataForStudents {
	kind: "student",
	roles: number[]
	importedCSV: RawBulkDataForStudent[]
}

/**
 * Shape to expect for creating employees in bulk
 */
export interface RawBulkDataForEmployees {
	kind: "reachable_employee" | "unreachable_employee",
	roles: number[]
	importedCSV: RawBulkDataForEmployee[]
}

/**
 * Shape to expect for creating users in bulk
 */
export type RawBulkData = RawBulkDataForStudents | RawBulkDataForEmployees

/**
 * Shape to expect after preprocessing bulk data of students
 *
 * Assumes password has been hashed
 */
export interface ProcessedDataForStudent extends Omit<RawBulkDataForStudent, "department"> {
	kind: "student",
	departmentID: number,
	attachedRoles: ({
		roleID: number
	})[]
}

/**
 * Shape to expect after preprocessing bulk data of employees
 *
 * Assumes password has been hashed
 */
export interface ProcessedDataForEmployee extends Omit<RawBulkDataForEmployee, "department"> {
	kind: "reachable_employee" | "unreachable_employee",
	departmentID: number,
	attachedRoles: ({
		roleID: number
	})[]
}

/**
 * Shape to expect for creating reachable employees in bulk or updating employee schedule.
 */
export interface RawEmployeeSchedule {
	scheduleStart: number,
	scheduleEnd: number,
	dayName: Day
}

/**
 * Used to indicate if the file-like entity should be included in the serialized structure of
 * file-like model.
 */
export interface FileLikeTransformerOptions {
	raw: boolean
}

/**
 * Used to indicate if the signature should be included in the serialized structure of signature
 * model.
 */
export interface SignatureTransformerOptions {
	raw: boolean
}

/**
 * Used to indicate if the profile picture should be included in the serialized structure of profile
 * picture model.
 */
export interface ProfilePictureTransformerOptions {
	raw: boolean
}

/**
 * Useful for updating the many-to-many relationships
 */
export interface SegregatedIDs { newIDs: number[], deletedIDs: number[] }

export interface IncludedRelationships<T extends string = string> {
	included: T[]
}

export interface Time {
	hours: number,
	minutes: number
}
