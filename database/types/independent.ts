/**
 * @module IndependentDatabaseSpecificTypes
 * @description This module contains types used only in database and do not depend from other
 * packages.
 */

/**
 * Common shape to expect for creating profiles in bulk
 */
export interface CommonBulkData {
	name: string,
	email: string,
	department: string
}

/**
 * Shape to expect for creating students profiles in bulk
 */
export interface BulkCreateStudents {
	kind: "student",
	importedCSV: (CommonBulkData & {
		studentNumber: string,
	})[]
}

/**
 * Shape to expect for creating employees in bulk
 */
export interface BulkCreateEmployees {
	kind: "reachable_employee",
	importedCSV: CommonBulkData[]
}
