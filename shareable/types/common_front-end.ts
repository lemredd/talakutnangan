/**
 * @module IndependentCommonFrontEndTypes
 * @description This module contains types commonly originally used in front-end and do not depend
 * from other packages. However, they can be used by the other parts of the repository.
 */

import type { Serializable, Day } from "$/types/database"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedStudentDetailDocument } from "$/types/documents/student_detail"
import type { DeserializedEmployeeScheduleListDocument } from "$/types/documents/employee_schedule"

/**
 * Shape of deserialized user profile if authenticated
 */
export interface UserProfile extends Serializable {
	data: StudentProfileData | ReachableEmployeeProfileData | UnreachableEmployeeProfileData,
	meta: {
		hasDefaultPassword: boolean|null
	}
}

interface ProfileData extends Serializable {
	type: "user",
	id: number,
	name: string,
	email: string,
	roles: DeserializedRoleListDocument
}

/**
 * Shape of profile data for students
 */
export interface StudentProfileData extends ProfileData {
	kind: "student",
	studentDetail: DeserializedStudentDetailDocument
}

/**
 * Shape of profile data for reachable employees
 */
export interface ReachableEmployeeProfileData extends ProfileData {
	kind: "reachable_employee",
	employeeSchedules: DeserializedEmployeeScheduleListDocument
}

/**
 * Shape of profile data for unreachable employees
 */
export interface UnreachableEmployeeProfileData extends ProfileData {
	kind: "unreachable_employee"
}
