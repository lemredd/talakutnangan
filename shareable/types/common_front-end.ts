/**
 * @module IndependentCommonFrontEndTypes
 * @description This module contains types commonly originally used in front-end and do not depend
 * from other packages. However, they can be used by the other parts of the repository.
 */

import type { Serializable, Day } from "$/types/database"

/**
 * Shape of serialized roles
 */
interface Roles extends Serializable {
	data: (Serializable & {
		type: "role",
		id: number
		userFlags: number
	})[]
}

/**
 * Shape of serialized user profile if authenticated
 */
export interface UserProfile extends Serializable {
	data: StudentProfileData | ReachableEmployeeProfileData | UnreachableEmployeeProfileData
}

interface ProfileData extends Serializable {
	type: "user",
	id: number,
	name: string,
	email: string,
	roles: Roles
}

/**
 * Shape of profile data for students
 */
export interface StudentProfileData extends ProfileData {
	kind: "student",
	studentDetail: {
		data: {
			studentNumber: string
		}
	}
}

interface EmployeeSchedule extends Serializable {
	data: {
		scheduleStart: number,
		scheduleEnd: number,
		dayName: Day
	}
}

/**
 * Shape of profile data for reachable employees
 */
export interface ReachableEmployeeProfileData extends ProfileData {
	kind: "reachable_employee",
	employeeSchedules: {
		data: EmployeeSchedule[]
	}
}

/**
 * Shape of profile data for unreachable employees
 */
export interface UnreachableEmployeeProfileData extends ProfileData {
	kind: "unreachable_employee"
}
