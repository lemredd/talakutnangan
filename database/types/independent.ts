/**
 * @module IndependentDatabaseSpecificTypes
 * @description This module contains types used only in database and do not depend from other
 * packages.
 */

/**
 * Shape to expect for creating students profiles in bulk
 */
export interface BulkCreateStudents {
	kind: "student",
	importedCSV: {
		studentNumber: string,
		name: string,
		email: string,
		department: string
	}[]
}

/**
 * Shape to expect for creating employees in bulk
 */
export interface BulkCreateEmployees {
	kind: "reachable_employee",
	importedCSV: {
		name: string,
		email: string,
		department: string
	}[]
}
