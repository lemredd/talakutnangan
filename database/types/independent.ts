/**
 * @module IndependentDatabaseSpecificTypes
 * @description This module contains types used only in database and do not depend from other
 * packages.
 */

/**
 * Common shape to expect for creating profiles in bulk
 */
export interface CommonRawBulkData {
	name: string,
	email: string,
	department: string,
	password: string
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
export interface RawBulkDataForEmployee extends CommonRawBulkData {}

/**
 * Shape to expect for creating students profiles in bulk
 */
export interface RawBulkDataForStudents {
	kind: "student",
	importedCSV: RawBulkDataForStudent[]
}

/**
 * Shape to expect for creating employees in bulk
 */
export interface RawBulkDataForEmployees {
	kind: "reachable_employee",
	importedCSV: RawBulkDataForEmployee[]
}

/**
 * Shape to expect after preprocessing bulk data of students
 *
 * Assumes password has been hashed
 */
export interface ProcessedDataForStudent extends Omit<RawBulkDataForStudent, "department"> {
	kind: "student",
	departmentID: number
}

/**
 * Shape to expect after preprocessing bulk data of employees
 *
 * Assumes password has been hashed
 */
export interface ProcessedDataForEmployee extends Omit<RawBulkDataForEmployee, "department"> {
	kind: "reachable_employee",
	departmentID: number
}
