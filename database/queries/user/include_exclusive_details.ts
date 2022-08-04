import type { FindOptions } from "%/types/dependent"

import Log from "$!/singletons/log"

import Signature from "%/models/signature"
import StudentDetail from "%/models/student_detail"
import EmployeeSchedule from "%/models/employee_schedule"

/**
 * Includes either employee schedules (if reachable employee) or student details (if student), and
 * the signature.
 */
export default function<T>(
	currentState: FindOptions<T>,
	_constraints: { [key: string]: any }
): FindOptions<T> {
	const newState = { ...currentState }

	if (newState.include === undefined) {
		newState.include = []
	}

	(newState.include as any[])!.push(StudentDetail, EmployeeSchedule, Signature)

	Log.trace("pipeline", "applied exclusive details includer")

	return newState
}
